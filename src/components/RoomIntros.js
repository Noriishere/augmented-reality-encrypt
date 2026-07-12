export const ROOM_INTROS = {
  'Raksha Basic': {
    title: 'RAKSHA BASIC',
    subtitle: 'MODUL PELATIHAN — TINGKAT DASAR',
    caseText:
      'Kamu baru saja ditugaskan sebagai staf keamanan siber junior di {{roomName}}. ' +
      'Sistem mendeteksi aktivitas mencurigakan di ruang server. Telusuri lingkungan, ' +
      'temukan setiap petunjuk, dan selesaikan teka-teki untuk mengamankan fasilitas ' +
      'sebelum data perusahaan bocor.',
  },

  'Raksha Basic:corridor': {
    title: 'RAKSHA BASIC',
    subtitle: 'LEVEL 2 — KORIDOR AKSES',
    caseText:
      'Pintu ruang server berhasil terbuka. Di koridor ini kamu menemukan jejak yang ' +
      'ditinggalkan staf sebelumnya. Periksa setiap sudut sebelum melangkah ke ruang berikutnya.',
  },

  'Raksha Basic:room2': {
    title: 'RAKSHA BASIC',
    subtitle: 'LEVEL 3 — RUANG KENDALI',
    caseText:
      'Kamu memasuki ruang kendali utama fasilitas. Gunakan semua catatan yang sudah ' +
      'kamu kumpulkan untuk membuka akses terakhir dan menuntaskan misi ini.',
  },

  'Raksha Expert': {
    title: 'RAKSHA EXPERT',
    subtitle: 'MODUL PELATIHAN — TINGKAT LANJUT',
    caseText:
      'Selamat datang di {{roomName}}. Kali ini tidak ada petunjuk yang mudah — kamu akan ' +
      'menghadapi simulasi serangan siber nyata dan harus mengambil keputusan cepat untuk ' +
      'melindungi sistem sebelum waktu habis.',
  },
};

/**
 * Ambil data intro untuk kombinasi room + stage saat ini.
 * Mengembalikan null kalau tidak ada entry (misal LOBBY).
 */
export function resolveRoomIntro(currentRoom, roomStage) {
  const specificKey = `${currentRoom}:${roomStage}`;
  const data = ROOM_INTROS[specificKey] || ROOM_INTROS[currentRoom];
  if (!data) return null;

  const fill = (text) => text.replaceAll('{{roomName}}', data.title);

  return {
    title: data.title,
    subtitle: data.subtitle,
    caseText: fill(data.caseText),
  };
}