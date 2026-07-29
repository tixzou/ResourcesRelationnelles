import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../../app/administrateur/page';
import ResourcesHeader from '../../components/ressources/ResourcesHeader';
import PublicResourcesList from '../../components/ressources/PublicResourcesList';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('../../components/admin/AdminRessourcesManager', () => function AdminRessourcesManager() {
  return <div>Gestion ressources mock</div>;
});

jest.mock('../../components/admin/AdminUsersManager', () => function AdminUsersManager() {
  return <div>Gestion utilisateurs mock</div>;
});

jest.mock('../../components/admin/AdminStatsManager', () => function AdminStatsManager() {
  return <div>Stats mock</div>;
});

const mockUseSession = useSession as jest.Mock;

describe('Regression tests frontend - comportements a ne pas casser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('13. Espace personnel cache si deconnecte', async () => {
    // Test de non-regression: un visiteur non connecte ne voit pas l'espace personnel.
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/category')) {
        return Promise.resolve({ ok: true, json: async () => [] });
      }
      return Promise.resolve({ ok: true, json: async () => [] });
    });

    render(<ResourcesHeader />);

    // On attend la fin des fetchs lances par useEffect pour eviter les warnings act().
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/category'));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/ressource'));
    expect(screen.queryByText('Espace personnel')).not.toBeInTheDocument();
  });

  it('14. Administration moderateur - cache utilisateurs et statistiques', () => {
    // Test de non-regression: un moderateur ne doit pas acceder aux onglets reserves admin.
    mockUseSession.mockReturnValue({
      data: { accessToken: 'token', user: { id: '2', role: 'MODERATEUR' } },
      status: 'authenticated',
    });

    render(<AdminDashboard />);

    expect(screen.getByText('Ressources & catégories')).toBeInTheDocument();
    expect(screen.queryByText('Comptes Citoyens')).not.toBeInTheDocument();
    expect(screen.queryByText('Statistiques & Exports')).not.toBeInTheDocument();
  });

  it('15. Ressource incomplete - ne plante pas si contenu ou categorie manquent', async () => {
    // Test de non-regression: une ressource partielle reste affichable dans le catalogue.
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Ressource minimale',
          content: null,
          type: 'ARTICLE',
          author: { firstName: 'Ada', lastName: 'Lovelace' },
          category: null,
        },
      ],
    });

    render(<PublicResourcesList search="" category="" />);

    expect(await screen.findByText('Ressource minimale')).toBeInTheDocument();
    expect(screen.getByText('Aucun contenu disponible pour cette ressource.')).toBeInTheDocument();
  });
});
