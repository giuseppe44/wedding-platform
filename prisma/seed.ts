import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Create a demo Photographer
  const photographer = await prisma.user.upsert({
    where: { email: 'demo@fotografo.it' },
    update: {},
    create: {
      email: 'demo@fotografo.it',
      password: 'demo_password', // Mock
      role: 'PHOTOGRAPHER',
      name: 'Studio Fotografico Demo',
    },
  })

  // 2. Create a demo Wedding
  const demoSlug = 'demo-chiara-e-matteo'
  const wedding = await prisma.timelineItem.upsert({
    where: { slug: demoSlug },
    update: {},
    create: {
      brideName: 'Chiara',
      groomName: 'Matteo',
      slug: demoSlug,
      date: new Date('2027-06-15T15:00:00Z'),
      themeColor: '#d4af37', // Gold
      welcomeMessage: 'Benvenuti nel nostro giorno speciale! Condividete qui le foto che scatterete, così avremo un ricordo visto dai vostri occhi.',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop',
      ownerId: photographer.id,
    },
  })

  // 3. Create Timeline
  await prisma.scheduleItem.createMany({
    data: [
      { time: '15:30', title: 'Arrivo degli Ospiti', description: 'Accoglienza con musica dal vivo', timelineItemId: wedding.id, order: 1530 },
      { time: '16:00', title: 'Cerimonia', description: 'Rito nel giardino botanico', timelineItemId: wedding.id, order: 1600 },
      { time: '18:00', title: 'Aperitivo', description: 'Terrazza panoramica sul lago', timelineItemId: wedding.id, order: 1800 },
      { time: '20:00', title: 'Cena', description: 'Salone degli specchi', timelineItemId: wedding.id, order: 2000 },
      { time: '23:30', title: 'Taglio della Torta e Festa', description: 'Si balla fino a tardi!', timelineItemId: wedding.id, order: 2330 },
    ],
  })

  // 4. Create Locations
  await prisma.location.createMany({
    data: [
      { name: 'Villa Belvedere', address: 'Via Regina, 1, Lago di Como', type: 'CEREMONY', timelineItemId: wedding.id },
    ],
  })

  // 5. Create some dummy approved media
  // For the demo, we just use unsplash placeholders
  await prisma.media.createMany({
    data: [
      { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop', status: 'APPROVED', timelineItemId: wedding.id, type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1511285605634-118bd3677467?q=80&w=2069&auto=format&fit=crop', status: 'APPROVED', timelineItemId: wedding.id, type: 'IMAGE' },
      { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop', status: 'APPROVED', timelineItemId: wedding.id, type: 'IMAGE' },
    ],
  })

  // 6. Create some demo guestbook messages
  await prisma.message.createMany({
    data: [
      { text: 'Auguri fantastici per una vita meravigliosa insieme! ❤️', guestName: 'Zia Marta', status: 'APPROVED', timelineItemId: wedding.id },
      { text: 'Siete bellissimi, che festa stupenda!', guestName: 'Marco e Giulia', status: 'APPROVED', timelineItemId: wedding.id },
    ],
  })

  console.log(`Demo wedding created at /w/${demoSlug}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
