"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {

    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={

          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}

/**
 * Documentation du fichier
 *
 * - Role : Boundary d'erreur client pour Next.js. Elle recoit l'erreur du segment et une fonction reset.
 * - Fonctionnement : Elle journalise l'erreur en console puis affiche un bouton permettant de tenter un nouveau rendu.
 * - A retenir : Elle protege l'utilisateur contre un ecran blanc en cas d'exception React.
 */
