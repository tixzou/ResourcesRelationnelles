import { render, screen, waitFor } from '@testing-library/react';
import NavbarComponent from '../../components/navbar';
import PublicResourcesList from '../../components/ressources/PublicResourcesList';
import ResourcesHeader from '../../components/ressources/ResourcesHeader';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;

describe('Unit tests frontend - composants principaux', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('1. Navbar deconnectee - affiche le bouton de connexion', () => {
    // Test unitaire: sans session, la navigation doit proposer la connexion.
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });

    render(<NavbarComponent />);

    expect(screen.getAllByText('Se connecter').length).toBeGreaterThan(0);
  });

  it('2. Navbar connectee - affiche le prenom et la deconnexion', () => {
    // Test unitaire: avec session, la navbar affiche l'utilisateur connecte.
    mockUseSession.mockReturnValue({
      data: { user: { name: 'Ada', role: 'CITOYEN' } },
      status: 'authenticated',
    });

    render(<NavbarComponent />);

    expect(screen.getByText('Ada')).toBeInTheDocument();
    expect(screen.getAllByText('Déconnexion').length).toBeGreaterThan(0);
  });

  it('3. Navbar admin/moderateur - affiche le lien Administration pour les roles autorises', () => {
    // Test unitaire: l'entree admin ne doit apparaitre que pour les roles de moderation/admin.
    mockUseSession.mockReturnValue({
      data: { user: { name: 'Marie', role: 'MODERATEUR' } },
      status: 'authenticated',
    });

    render(<NavbarComponent />);

    expect(screen.getAllByText('Espace Admin').length).toBeGreaterThan(0);
  });

  it('4. PublicResourcesList - affiche une carte ressource chargee depuis l API', async () => {
    // Test unitaire: la liste publique rend les informations essentielles d'une ressource.
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Ecoute active',
          content: 'Apprendre a mieux ecouter',
          type: 'ARTICLE',
          author: { firstName: 'Ada', lastName: 'Lovelace' },
          category: { name: 'Communication' },
          _count: { favoritedBy: 2 },
        },
      ],
    });

    render(<PublicResourcesList search="" category="" />);

    expect(await screen.findByText('Ecoute active')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
  });

  it('5. PublicResourcesList vide - affiche le message aucune ressource', async () => {
    // Test unitaire: une liste vide doit rester lisible pour l'utilisateur.
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => [] });

    render(<PublicResourcesList search="" category="" />);

    expect(await screen.findByText(/Aucune ressource publique/)).toBeInTheDocument();
  });

  it('6. ResourcesHeader - affiche le titre, la recherche et le filtre categorie', async () => {
    // Test unitaire: le bloc catalogue expose les controles principaux.
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/category')) {
        return Promise.resolve({ ok: true, json: async () => [{ id: 1, name: 'Famille' }] });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    render(<ResourcesHeader />);

    expect(screen.getByText('Catalogue de ressources')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Rechercher une ressource...')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Famille')).toBeInTheDocument());
  });
});
