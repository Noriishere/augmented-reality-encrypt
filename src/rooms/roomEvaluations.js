/* ============================================================
   ROOM EVALUATIONS — satu sumber kebenaran untuk konten
   evaluasi + pembelajaran di EvaluationRoom.
   Tambah ruangan baru cukup nambah entry di sini,
   TANPA nyentuh EvaluationRoom.jsx sama sekali.
   ============================================================ */
export const roomEvaluations = {
  'expert-room1': {
    roomLabel: 'RAKSHA EXPERT — RUANG 1: KRIPTOGRAFI & KEAMANAN PASSWORD',
    topic: 'Kriptografi Kunci Publik & Kekuatan Password',
    objective: 'Memahami cara kerja pasangan kunci publik/privat, dan faktor yang bikin sebuah password sulit dibobol (brute-force).',
    lessons: [
      'Kunci publik boleh disebar, kunci privat wajib dirahasiakan — tertukar sedikit saja bisa membuka celah besar.',
      'Panjang password berpengaruh jauh lebih besar ke waktu crack dibanding sekadar ganti huruf jadi simbol.',
      'Kombinasi acak 4 jenis karakter (besar, kecil, angka, simbol) menaikkan waktu brute-force secara eksponensial.',
    ],
    perfectMessage: 'Kamu berhasil menyusun password kuat dan mencocokkan pasangan kunci tanpa kesalahan. Kebiasaan ini adalah lini pertahanan pertama yang paling murah melawan serangan siber.',
    imperfectMessage: (mistakes) =>
      `Kamu berhasil lolos, tapi tercatat ${mistakes} kesalahan (salah pasangan kunci atau password lemah sempat lolos). Password lemah adalah salah satu penyebab kebocoran data paling umum di dunia nyata — evaluasi lagi polamu.`,
  },

  'basic-room1': {
    roomLabel: 'RAKSHA BASIC — RUANG 1: KRIPTOGRAFI KLASIK',
    topic: 'Sandi Caesar & Enkripsi Dasar',
    objective: 'Memahami konsep enkripsi/dekripsi sederhana sebagai fondasi sistem keamanan data modern.',
    lessons: [
      'Enkripsi mengubah plain text jadi cipher text agar tidak terbaca pihak tak berwenang.',
      'Sandi klasik seperti Caesar Cipher gampang dipecahkan, tapi prinsipnya mendasari algoritma enkripsi modern.',
      'Tanpa tahu kunci/metode dekripsi, data terenkripsi tidak bisa diakses secara sah.',
    ],
    perfectMessage: 'Kamu berhasil mendekripsi semua sandi tanpa kesalahan. Ketelitian membaca pola adalah modal penting saat menganalisis sistem keamanan.',
    imperfectMessage: (mistakes) =>
      `Kamu berhasil membuka gerbang, tapi tercatat ${mistakes} kesalahan input selama proses dekripsi. Coba lebih teliti baca hint sebelum submit jawaban.`,
  },

  'basic-room2': {
    roomLabel: 'RAKSHA BASIC — RUANG 2: REKAYASA SOSIAL',
    topic: 'Social Engineering & Phishing',
    objective: 'Mengenali taktik rekayasa sosial, dan memahami kenapa kredensial tidak boleh dibagikan ke pihak yang tidak terverifikasi — sekalipun terkesan dikenal atau mendesak.',
    lessons: [
      'Pelaku social engineering sering menyamar jadi teman, admin, atau keluarga untuk memancing kepercayaan.',
      'Rasa urgensi/ancaman adalah taktik umum supaya korban bertindak tanpa mikir panjang.',
      'Password/PIN tidak boleh dibagikan ke siapa pun, termasuk yang mengaku "admin resmi".',
    ],
    perfectMessage: 'Kamu tidak membagikan satu pun kredensial ke pihak tak terverifikasi. Kewaspadaan seperti ini adalah pertahanan utama melawan social engineering.',
    imperfectMessage: (mistakes) =>
      `Tercatat ${mistakes} kali kamu sempat membagikan informasi ke pihak tak terverifikasi. Ingat: kepercayaan di dunia maya harus diverifikasi ulang, bukan diasumsikan.`,
  },

  default: {
    roomLabel: 'SIMULASI KEAMANAN SIBER',
    topic: 'Kesadaran Keamanan Siber',
    objective: 'Menerapkan prinsip dasar keamanan siber dalam skenario simulasi.',
    lessons: [
      'Setiap keputusan kecil (klik tautan, share kode, pilih password) punya konsekuensi keamanan.',
      'Kewaspadaan dan ketelitian adalah pertahanan paling efektif yang bisa dilakukan siapa saja.',
    ],
    perfectMessage: 'Kamu menyelesaikan simulasi ini tanpa satu pun kesalahan. Pertahankan kebiasaan baik ini.',
    imperfectMessage: (mistakes) =>
      `Kamu berhasil menyelesaikan simulasi dengan ${mistakes} kesalahan tercatat. Pelajari lagi momen itu supaya nggak keulang di dunia nyata.`,
  },
};

export function getRoomEvaluation(roomKey) {
  return roomEvaluations[roomKey] || roomEvaluations.default;
}