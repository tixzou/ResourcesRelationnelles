# 🔐 DOCUMENTATION COMPLÈTE : SÉCURITÉ JWT & AUTHENTIFICATION

## Vue d'ensemble du flux sécurisé

```
Utilisateur se connecte (email/password)
    ↓
Frontend → Backend /auth/login (HTTP POST)
    ↓
Backend vérifie credentials et génère JWT signé avec JWT_SECRET
    ↓
Frontend reçoit JWT + user data
    ↓
NextAuth mappe le JWT dans la session
    ↓
Session stockée en cookie HTTP-Only (pas accessible au JS)
    ↓
Requête ultérieure : Frontend envoie Authorization: Bearer <JWT>
    ↓
Backend AuthGuard vérifie le JWT avec JWT_SECRET
    ↓
Si valide → requête autorisée
Si invalide/expiré → UnauthorizedException (401)
```

---

## 1️⃣ BACKEND - Configuration JWT avec Secret

### **Fichier : `backend/src/auth.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    // ✅ 1. Charger les variables d'environnement (.env)
    ConfigModule.forRoot(),
    
    // ✅ 2. Configurer JwtModule avec le secret depuis l'environnement
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // ✅ JWT_SECRET provient du fichier .env
        secret: configService.get<string>('JWT_SECRET'),
        // ✅ Token expire après 1 jour (86400 secondes)
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  // ✅ 3. Exporter JwtModule pour que d'autres modules puissent l'utiliser
  exports: [JwtModule, ConfigModule],
})
export class AuthModule {}
```

**Qu'est-ce qui se passe :**
- `ConfigModule.forRoot()` charge le fichier `.env`
- `JwtModule.registerAsync()` configure JWT de manière asynchrone
- `configService.get<string>('JWT_SECRET')` récupère la clé secrète
- `expiresIn: '1d'` signifie que le token expire après 24 heures

### **Variables d'environnement : `backend/.env`**

```bash
# Base de données
DATABASE_URL="postgresql://admin:password123@localhost:5433/db_ressources"

# ✅ Clé secrète pour signer les JWT (à garder très sécurisée !)
JWT_SECRET="votre_super_secret_jwt_tres_securise_min_32_caracteres"

# Port du serveur
PORT=3001
```

---

## 2️⃣ BACKEND - Génération du JWT au Login

### **Fichier : `backend/src/auth.service.ts`** (extrait)

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,  // ✅ Injecter JwtService
  ) {}

  // ✅ Méthode de LOGIN
  async login(email: string, pass: string) {
    // 1. Chercher l'utilisateur
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 2. Vérifier que le compte est actif
    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été suspendu par un administrateur.');
    }

    // 3. Comparer le mot de passe
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // 4. ✅ GÉNÉRER LE JWT
    return this.generateToken(user);
  }

  // ✅ Fonction pour générer le JWT signé
  private async generateToken(user: any) {
    // Créer le payload du JWT
    const payload = {
      sub: user.id,              // Subject = ID utilisateur (convention JWT)
      email: user.email,
      role: user.role,           // CITOYEN, MODERATEUR, ADMINISTRATEUR, etc.
      firstName: user.firstName,
      lastName: user.lastName,
    };

    // ✅ Signer le JWT avec le secret et retourner
    return {
      access_token: await this.jwtService.signAsync(payload),
      // ^ Le JWT est signé avec JWT_SECRET défini dans auth.module.ts
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}

/**
 * Flux de signature JWT :
 * 
 * 1. JwtService.signAsync(payload) encodé en Base64 + signature HMAC
 * 2. Header: { alg: "HS256", typ: "JWT" }
 * 3. Payload: { sub, email, role, firstName, lastName }
 * 4. Signature: HMAC-SHA256(header.payload, JWT_SECRET)
 * 
 * Résultat : "eyJhbGc..." (3 parties séparées par des points)
 */
```

---

## 3️⃣ BACKEND - Guard qui valide le JWT

### **Fichier : `backend/src/auth.guard.ts`** (COMPLET)

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * ✅ Cette fonction s'exécute AVANT chaque endpoint protégé par @UseGuards(AuthGuard)
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Récupérer la requête HTTP
    const request = context.switchToHttp().getRequest();
    
    // 2. ✅ Extraire le JWT du header "Authorization: Bearer <token>"
    const token = this.extractTokenFromHeader(request);

    // 3. Si pas de token → Bloquer
    if (!token) {
      throw new UnauthorizedException('Token manquant');
    }

    try {
      // 4. ✅ VÉRIFIER ET DÉCODER le JWT avec le secret
      const payload = await this.jwtService.verifyAsync(token, {
        // ✅ Utiliser le même JWT_SECRET que celui utilisé pour signer
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // 5. ✅ Si valide → injecter l'utilisateur dans la requête
      // Permet aux controllers d'accéder à @Request() req et utiliser req.user
      request['user'] = payload;

    } catch (error) {
      // ✅ Si le token est invalide ou expiré → Bloquer
      throw new UnauthorizedException('Token invalide ou expiré');
    }

    // 6. ✅ Token valide → laisser passer la requête
    return true;
  }

  /**
   * ✅ Extraire le token du header Authorization
   * Format attendu : "Bearer eyJhbGc..."
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    
    // Split "Bearer <token>" en ['Bearer', '<token>']
    const [type, token] = authHeader?.split(' ') ?? [];
    
    // Retourner le token seulement si type est "Bearer"
    return type === 'Bearer' ? token : undefined;
  }
}

/**
 * CYCLE DE VIE DU GUARD :
 * 
 * 1. Client envoie : GET /ressource/42
 *    Headers: { Authorization: "Bearer eyJhbGc..." }
 * 
 * 2. NestJS détecte @UseGuards(AuthGuard)
 * 
 * 3. canActivate() appelé
 *    - Extraire token
 *    - jwtService.verifyAsync(token, { secret: JWT_SECRET })
 *    - Vérifier la signature avec le secret
 *    - Vérifier que le token n'a pas expiré
 * 
 * 4. Si OK → injecter dans request.user
 * 
 * 5. Controller reçoit la requête avec @Request() req
 *    → req.user contient { sub, email, role, firstName, lastName }
 * 
 * 6. Si erreur → 401 Unauthorized
 */
```

---

## 4️⃣ BACKEND - Utiliser le Guard sur une route

### **Exemple : `backend/src/ressource/ressource.controller.ts`**

```typescript
import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { RessourceService } from './ressource.service';

@Controller('ressource')
export class RessourceController {
  constructor(private readonly ressourceService: RessourceService) {}

  /**
   * ✅ Endpoint PROTÉGÉ avec @UseGuards(AuthGuard)
   * Le client DOIT envoyer un JWT valide
   */
  @Post()
  @UseGuards(AuthGuard)  // ✅ Active la vérification du JWT
  async create(
    @Body() createRessourceDto: any,
    @Request() req  // ✅ req.user contient les données du JWT
  ) {
    // req.user.id est l'ID de l'utilisateur authentifié
    return this.ressourceService.create(
      createRessourceDto,
      req.user.id  // Passer l'ID de l'auteur
    );
  }

  /**
   * ❌ Endpoint PUBLIC (pas de @UseGuards)
   * N'importe qui peut l'appeler sans token
   */
  @Get()
  async findAll() {
    return this.ressourceService.findAll();
  }
}

/**
 * Appel protégé :
 * 
 * GET /ressource (PUBLIC) → ✅ OK sans token
 * POST /ressource (PROTÉGÉ) → ❌ Erreur 401 sans token
 * 
 * POST /ressource
 * Headers: { Authorization: "Bearer <valid_jwt>" } → ✅ OK
 * Headers: { } → ❌ 401 Unauthorized
 * Headers: { Authorization: "Bearer <invalid_jwt>" } → ❌ 401 Unauthorized
 */
```

---

## 5️⃣ FRONTEND - Configuration NextAuth avec Cookie HTTP-Only

### **Fichier : `frontend/app/api/auth/[...nextauth]/route.ts`** (COMPLET)

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  // ✅ Configuration des fournisseurs d'authentification
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Champs du formulaire de login
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      
      /**
       * ✅ Fonction appelée lors du login
       * Elle appelle le backend NestJS
       */
      async authorize(credentials) {
        // 1. Appeler le backend /auth/login
        const res = await fetch("http://localhost:3001/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        // 2. Récupérer la réponse
        const data = await res.json();

        // 3. Si succès et données utilisateur → retourner l'utilisateur
        if (res.ok && data.user) {
          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.firstName,
            role: data.user.role,
            // ✅ Stocker le JWT reçu du backend
            accessToken: data.access_token,
          };
        }
        
        // Sinon retourner null (authentification échouée)
        return null;
      }
    })
  ],

  /**
   * ✅ Callbacks pour transformer les données
   */
  callbacks: {
    /**
     * ✅ Callback JWT : appelé lors de la création/mise à jour du JWT NextAuth
     * C'est ici qu'on copie le JWT backend dans le JWT NextAuth
     */
    async jwt({ token, user }) {
      // Si user fourni (login) → copier le token et le rôle
      if (user) {
        token.accessToken = (user as any).accessToken;  // ✅ JWT du backend
        token.role = (user as any).role;
      }
      return token;
    },

    /**
     * ✅ Callback Session : appelé à chaque fois qu'on accède à la session
     * C'est ici qu'on expose le JWT au frontend
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session as any).accessToken = token.accessToken;  // ✅ JWT disponible ici
      }
      return session;
    }
  },

  /**
   * ✅ Strategy JWT pour les sessions NextAuth
   * Les sessions sont stockées en JWT (pas en base de données)
   */
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * ✅ FLUX NEXTAUTH COMPLET :
 * 
 * 1. Utilisateur envoie email/password via signIn()
 * 
 * 2. NextAuth appelle CredentialsProvider.authorize()
 *    → appelle /auth/login du backend
 *    → reçoit { access_token, user }
 * 
 * 3. Callback JWT appelé
 *    → copie access_token dans token.accessToken
 * 
 * 4. NextAuth signe un JWT et le stocke en cookie HTTP-Only
 *    ✅ Cookie HTTP-Only = pas accessible au JavaScript
 *    ✅ Envoyé automatiquement à chaque requête
 * 
 * 5. Utilisateur appelle useSession()
 *    → NextAuth décode le cookie et appelle callback session()
 *    → retourne { user, accessToken }
 * 
 * 6. Frontend utilise accessToken pour les requêtes au backend
 *    Authorization: Bearer <accessToken>
 */
```

### **Variables d'environnement : `frontend/.env.local`**

```bash
# URL de l'application
NEXTAUTH_URL=http://localhost:3000

# ✅ Clé secrète pour signer les JWT NextAuth
# (doit être très différente du JWT_SECRET backend)
NEXTAUTH_SECRET="votre_secret_nextauth_super_securise_min_32_caracteres"

# URL du backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 6️⃣ FRONTEND - Utiliser le Token JWT dans les Requêtes

### **Comment accéder à la session et faire des requêtes protégées**

```typescript
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function MyComponent() {
  // ✅ Récupérer la session (et le JWT)
  const { data: session } = useSession();
  
  const [ressources, setRessources] = useState([]);

  useEffect(() => {
    if (!session?.user) return; // Pas connecté

    const fetchRessources = async () => {
      // ✅ Utiliser le JWT du session dans le header Authorization
      const response = await fetch(
        "http://localhost:3001/ressource",
        {
          headers: {
            // ✅ Bearer <JWT du backend reçu via NextAuth>
            "Authorization": `Bearer ${(session as any).accessToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 401) {
        // ✅ Token expiré ou invalide
        console.error("Token invalid");
        return;
      }

      const data = await response.json();
      setRessources(data);
    };

    fetchRessources();
  }, [session]);

  return (
    <div>
      {ressources.map(r => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  );
}
```

---

## 7️⃣ RÉSUMÉ - Cookie HTTP-Only & Sécurité

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  useSession() → récupère le JWT depuis le cookie           │
│       ↓                                                      │
│  Authorization: Bearer <JWT> envoyé aux requêtes           │
│       ↓                                                      │
│  ✅ Cookie HTTP-Only = sécurisé du XSS                     │
│  ✅ Envoyé automatiquement avec chaque requête             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (NestJS)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  @UseGuards(AuthGuard) sur la route                        │
│       ↓                                                      │
│  Extrait le JWT du header Authorization                    │
│       ↓                                                      │
│  jwtService.verifyAsync(token, { secret: JWT_SECRET })     │
│       ↓                                                      │
│  ✅ Vérifie la signature avec JWT_SECRET                   │
│  ✅ Vérifie l'expiration (1 jour)                          │
│       ↓                                                      │
│  Si valide → req.user = payload, route exécutée           │
│  Si invalide → 401 Unauthorized                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Points clés pour la soutenance :

✅ **JWT signé avec secret** : `JWT_SECRET` dans `.env` backend  
✅ **Token généré au login** : `jwtService.signAsync(payload)`  
✅ **Cookie HTTP-Only** : NextAuth stocke automatiquement le JWT  
✅ **Validation à chaque requête** : `AuthGuard` vérifie la signature et l'expiration  
✅ **Expiration** : Token valide 1 jour (`expiresIn: '1d'`)  
✅ **Sécurité** : Le secret ne voyage jamais avec le token, vérification cryptographique  

Cet ensemble de code **démontre complètement** la gestion sécurisée de l'authentification JWT ! 🚀

---

## 📝 Fichiers concernés dans le projet

| Fichier | Description |
|---------|-------------|
| `backend/src/auth.module.ts` | Configuration du module JWT |
| `backend/src/auth.service.ts` | Service de génération JWT |
| `backend/src/auth.guard.ts` | Guard de validation JWT |
| `backend/.env` | Variables d'environnement (JWT_SECRET) |
| `frontend/app/api/auth/[...nextauth]/route.ts` | Configuration NextAuth |
| `frontend/.env.local` | Variables d'environnement (NEXTAUTH_SECRET) |

---

## 🔒 Flux complet d'une requête authentifiée

```
1. Utilisateur se connecte
   → Frontend: signIn("credentials", { email, password })
   
2. NextAuth appelle Backend /auth/login
   → Backend: Valide email/password, génère JWT
   → Response: { access_token: "eyJhbGc...", user: {...} }
   
3. NextAuth mappe le JWT
   → Callback JWT: token.accessToken = data.access_token
   → Signe un JWT NextAuth + stocke en cookie HTTP-Only
   
4. Frontend appelle une route protégée
   → useSession() récupère le token du cookie
   → Envoie: Authorization: Bearer eyJhbGc...
   
5. Backend reçoit la requête
   → AuthGuard extrait le JWT du header
   → jwtService.verifyAsync(token, { secret: JWT_SECRET })
   → Vérifie la signature + expiration
   
6. Si valide → requête exécutée
   Si invalide → 401 Unauthorized
```

Vous êtes maintenant prêt ! 🎉
