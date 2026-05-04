import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from '../../components/authentification/authModal';
import ResourcesHeader from '../../components/ressources/ResourcesHeader';
import MyResourcesManager from '../../components/ressources/MyResourcesManager';
import RessourceDetail from '../../app/ressources/[id]/page';
import { signIn, useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '7' }),
}));

const mockUseSession = useSession as jest.Mock;
const mockSignIn = signIn as jest.Mock;

const resourcesPayload = [
  {
    id: 1,
    title: 'Communication bienveillante',
    content: 'Parler avec clarte',
    type: 'ARTICLE',
    author: { firstName: 'Ada', lastName: 'Lovelace' },
    category: { name: 'Communication' },
    _count: { favoritedBy: 1 },
  },
  {
    id: 2,
    title: 'Jeu familial',
    content: 'Activite pour la maison',
    type: 'JEU',
    author: { firstName: 'Grace', lastName: 'Hopper' },
    category: { name: 'Famille' },
    _count: { favoritedBy: 0 },
  },
];

const mockCatalogueFetch = () => {
  (global.fetch as jest.Mock).mockImplementation((url: string) => {
    if (url.includes('/category')) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: 1, name: 'Communication' },
          { id: 2, name: 'Famille' },
        ],
      });
    }
    if (url.includes('/ressource')) {
      return Promise.resolve({ ok: true, json: async () => resourcesPayload });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
};

describe('Functional tests frontend - parcours utilisateur', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    global.fetch = jest.fn();
  });

  it('7. Recherche catalogue - filtre les ressources par texte', async () => {
    // Test fonctionnel: l'utilisateur tape une recherche et la liste se met a jour.
    const user = userEvent.setup();
    mockCatalogueFetch();

    render(<ResourcesHeader />);

    expect(await screen.findByText('Communication bienveillante')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText('Rechercher une ressource...'), 'familial');

    expect(screen.queryByText('Communication bienveillante')).not.toBeInTheDocument();
    expect(screen.getByText('Jeu familial')).toBeInTheDocument();
  });

  it('8. Filtre categorie - garde uniquement les ressources de la categorie choisie', async () => {
    // Test fonctionnel: le select categorie pilote bien l'affichage du catalogue.
    const user = userEvent.setup();
    mockCatalogueFetch();

    render(<ResourcesHeader />);

    expect(await screen.findByText('Communication bienveillante')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox'), 'Famille');

    expect(screen.queryByText('Communication bienveillante')).not.toBeInTheDocument();
    expect(screen.getByText('Jeu familial')).toBeInTheDocument();
  });

  it('9. Connexion - soumet signIn avec email et mot de passe', async () => {
    // Test fonctionnel: le formulaire de login appelle NextAuth credentials.
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ ok: true });

    render(<AuthModal />);

    await user.click(screen.getByText('Se connecter'));
    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByPlaceholderText('exemple@mail.com'), 'ada@test.fr');
    await user.type(within(dialog).getByPlaceholderText('******'), 'secret');
    await user.click(within(dialog).getByRole('button', { name: 'Se connecter' }));

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'ada@test.fr',
        password: 'secret',
      }),
    );
  });

  it('10. Inscription - appelle POST /auth/register avec les champs attendus', async () => {
    // Test fonctionnel: le formulaire d'inscription construit le payload attendu par le backend.
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({ ok: true });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: async () => ({}) });

    render(<AuthModal />);

    await user.click(screen.getByText('Se connecter'));
    await user.click(screen.getByText("S'inscrire"));
    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByPlaceholderText('Jean'), 'Ada');
    await user.type(within(dialog).getByPlaceholderText('Dupont'), 'Lovelace');
    await user.type(within(dialog).getByPlaceholderText('exemple@email.com'), 'ada@test.fr');
    const passwords = within(dialog).getAllByPlaceholderText('******');
    await user.type(passwords[0], 'Secret123!');
    await user.type(passwords[1], 'Secret123!');
    for (const checkbox of within(dialog).getAllByRole('checkbox')) {
      await user.click(checkbox);
    }
    await user.click(within(dialog).getByRole('button', { name: "S'inscrire" }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@test.fr',
            password: 'Secret123!',
          }),
        }),
      ),
    );
  });

  it('11. Favori detail ressource - appelle la route favorite avec le token', async () => {
    // Test fonctionnel: le bouton favori du detail appelle l'API protegee.
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({
      data: { accessToken: 'token-123', user: { id: '1' } },
      status: 'authenticated',
    });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 7,
          title: 'Ressource detail',
          content: 'Contenu detail',
          type: 'ARTICLE',
          isFavorited: false,
          createdAt: '2026-05-04T00:00:00.000Z',
          author: { firstName: 'Ada', lastName: 'Lovelace' },
          comments: [],
        }),
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    render(<RessourceDetail />);

    expect(await screen.findByText('Ressource detail')).toBeInTheDocument();
    await user.click(screen.getByLabelText('icon-button'));

    expect(global.fetch).toHaveBeenLastCalledWith('http://localhost:3001/ressource/7/favorite', {
      method: 'POST',
      headers: { Authorization: 'Bearer token-123' },
    });
  });

  it('12. Creation ressource utilisateur - envoie POST /ressource avec le token', async () => {
    // Test fonctionnel: l'espace personnel cree une ressource authentifiee.
    const user = userEvent.setup();
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 15 }) })
      .mockResolvedValue({ ok: true, json: async () => [] });

    render(<MyResourcesManager token="token-abc" search="" category="" />);

    await user.click(await screen.findByText('Nouvelle ressource'));
    const dialog = screen.getByRole('dialog');
    await user.type(within(dialog).getByLabelText('Titre'), 'Nouvelle idee');
    await user.type(within(dialog).getByLabelText('Contenu'), 'Contenu de test');
    await user.click(within(dialog).getByRole('button', { name: 'Publier' }));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/ressource',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({ Authorization: 'Bearer token-abc' }),
        }),
      ),
    );
  });
});
