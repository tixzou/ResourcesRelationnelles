"use client";

import { useState } from "react";
import { Button } from "@heroui/button";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <Button radius="full" onPress={() => setCount(count + 1)}>
      Count is {count}
    </Button>
  );
};

/**
 * Documentation du fichier
 *
 * - Role : Composant exemple avec etat local. Il affiche un bouton HeroUI et incremente un compteur au clic.
 * - Fonctionnement : Il n'est pas relie au domaine metier de l'application.
 * - A retenir : Il peut etre supprime si le template doit etre nettoye.
 */
