import { NextResponse } from "next";
import { prisma } from "@/lib/prisma";

const HOST = "www.gentiluna.com";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_KEY = "7f8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINTS = [
  { name: "IndexNow Global (Bing / DuckDuckGo / ChatGPT Search / Yep)", url: "https://api.indexnow.org/indexnow" },
  { name: "Microsoft Bing", url: "https://www.bing.com/indexnow" },
  { name: "Yandex", url: "https://yandex.com/indexnow" },
  { name: "Seznam", url: "https://search.seznam.cz/indexnow" },
  { name: "Naver", url: "https://searchadvisor.naver.com/indexnow" },
];

export async function GET() {
  return submitIndexNow();
}

export async function POST() {
  return submitIndexNow();
}

async function submitIndexNow() {
  const staticUrls = [
    `${BASE_URL}/`,
    `${BASE_URL}/sposi`,
    `${BASE_URL}/fornitori`,
    `${BASE_URL}/professionisti`,
    `${BASE_URL}/prezzi`,
    `${BASE_URL}/assistenza`,
    `${BASE_URL}/privacy`,
    `${BASE_URL}/terms`,
  ];

  let proUrls: string[] = [];
  try {
    const pros = await prisma.professionalProfile.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    proUrls = pros.map((p) => `${BASE_URL}/pro/${p.slug}`);
  } catch {
    // Fallback alle sole pagine statiche se il DB non risponde
  }

  const urlList = [...staticUrls, ...proUrls];

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const results = await Promise.all(
    INDEXNOW_ENDPOINTS.map(async (endpoint) => {
      try {
        const res = await fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });
        return {
          engine: endpoint.name,
          status: res.status,
          ok: res.status === 200 || res.status === 202,
        };
      } catch (err: any) {
        return {
          engine: endpoint.name,
          status: 0,
          ok: false,
          error: err?.message || "Errore di rete",
        };
      }
    })
  );

  return Response.json({
    success: true,
    host: HOST,
    keyLocation: KEY_LOCATION,
    submittedCount: urlList.length,
    urlList,
    engines: results,
  });
}
