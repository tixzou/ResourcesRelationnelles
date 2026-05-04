import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

/**
 * Documentation du fichier
 *
 * - Role : Controleur racine de l'API. Il expose GET / et delegue la reponse a AppService.
 * - Fonctionnement : Il sert surtout de route de verification rapide pour savoir si le backend repond.
 * - A retenir : La logique metier reelle est dans les controleurs de domaine.
 */
