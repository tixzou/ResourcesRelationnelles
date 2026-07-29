"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Bandeau d'information cookies (RGPD).
 *
 * La plateforme n'utilise que des cookies strictement necessaires (session de connexion),
 * donc il s'agit d'une information et non d'un mur de consentement. Le choix de l'utilisateur
 * est memorise dans le localStorage pour ne pas reafficher le bandeau.
 */
const STORAGE_KEY = "cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage indisponible : on n'affiche pas le bandeau plutot que de planter.
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Information sur les cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-blue-100 bg-white/95 px-4 py-4 shadow-lg backdrop-blur sm:px-8"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-600">
          Ce site utilise uniquement des cookies <strong>strictement necessaires</strong> a son
          fonctionnement (maintien de votre session). Aucun traceur publicitaire.{" "}
          <Link href="/confidentialite" className="font-semibold text-[#003E7E] underline">
            En savoir plus
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-[#1B365D] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#003E7E]"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
