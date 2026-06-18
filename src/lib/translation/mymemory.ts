import axios from 'axios';

const API_URL = 'https://api.mymemory.translated.net/get';

type MyMemoryResponse = {
  responseStatus: number;
  responseDetails: string;
  quotaFinished?: boolean;
  responseData: {
    translatedText: string;
  };
};

const LANG_TO_API: Record<string, string> = {
  zh: 'zh-CN',
  'zh-Hans': 'zh-CN',
  'zh-Hant': 'zh-TW',
  'pt-BR': 'pt-BR',
};

function toApiLang(code: string): string {
  return LANG_TO_API[code] ?? code;
}

async function translateOne(
  text: string,
  source: string,
  target: string,
): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL?.trim();

  const {data} = await axios.get<MyMemoryResponse>(API_URL, {
    params: {
      q: text,
      langpair: `${toApiLang(source)}|${toApiLang(target)}`,
      ...(email ? {de: email} : {}),
    },
    timeout: 30_000,
  });

  if (data.quotaFinished) {
    throw new Error(
      'Daily translation limit reached. Add MYMEMORY_EMAIL to .env.local for a higher limit.',
    );
  }

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'Translation failed');
  }

  return data.responseData.translatedText.trim();
}

export async function translateTexts(
  texts: string[],
  source: string,
  target: string,
): Promise<string[]> {
  return Promise.all(texts.map(text => translateOne(text, source, target)));
}
