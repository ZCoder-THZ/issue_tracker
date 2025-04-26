// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client';
// const { hash } = require('bcryptjs'); // Alternative import syntax


// const prisma = new PrismaClient();

// async function main() {
//     // Clear existing data
//     await prisma.notification.deleteMany();
//     await prisma.issueCommand.deleteMany();
//     await prisma.issueImage.deleteMany();
//     await prisma.issue.deleteMany();
//     await prisma.user.deleteMany();
//     await prisma.account.deleteMany();
//     await prisma.session.deleteMany();
//     await prisma.verificationToken.deleteMany();

//     // Create users
//     const admin = await prisma.user.create({
//         data: {
//             name: 'Admin User',
//             email: 'admin@example.com',
//             role: 1, // Admin role
//             password: await hash('admin123', 12),
//             image: 'https://randomuser.me/api/portraits/men/1.jpg',
//             emailVerified: new Date(),
//         },
//     });

//     const developer1 = await prisma.user.create({
//         data: {
//             name: 'Developer One',
//             email: 'dev1@example.com',
//             role: 2, // Developer role
//             password: await hash('dev123', 12),
//             image: 'https://randomuser.me/api/portraits/women/2.jpg',
//             emailVerified: new Date(),
//         },
//     });

//     const developer2 = await prisma.user.create({
//         data: {
//             name: 'Developer Two',
//             email: 'dev2@example.com',
//             role: 2, // Developer role
//             password: await hash('dev123', 12),
//             image: 'https://randomuser.me/api/portraits/men/3.jpg',
//             emailVerified: new Date(),
//         },
//     });

//     const regularUser = await prisma.user.create({
//         data: {
//             name: 'Regular User',
//             email: 'user@example.com',
//             role: 0, // Regular user
//             password: await hash('user123', 12),
//             image: 'https://randomuser.me/api/portraits/women/4.jpg',
//             emailVerified: new Date(),
//         },
//     });

//     // Create issues
//     const issue1 = await prisma.issue.create({
//         data: {
//             title: 'Login page not working',
//             description: 'Users are unable to login on the login page. Getting 500 error.',
//             status: 'OPEN',
//             priority: 'high',
//             user: { connect: { id: regularUser.id } },
//             assignedToUser: { connect: { id: developer1.id } },
//             assignedDate: new Date(),
//         },
//     });

//     const issue2 = await prisma.issue.create({
//         data: {
//             title: 'Profile page layout broken',
//             description: 'The profile page layout is broken on mobile devices.',
//             status: 'IN_PROGRESS',
//             priority: 'medium',
//             user: { connect: { id: regularUser.id } },
//             assignedToUser: { connect: { id: developer2.id } },
//             assignedDate: new Date(),
//         },
//     });

//     const issue3 = await prisma.issue.create({
//         data: {
//             title: 'Add dark mode support',
//             description: 'Users are requesting dark mode for the application.',
//             status: 'OPEN',
//             priority: 'low',
//             user: { connect: { id: admin.id } },
//         },
//     });

//     // Create issue images
//     await prisma.issueImage.createMany({
//         data: [
//             {
//                 issueId: issue1.id,
//                 imageUrl: 'https://example.com/images/login-error.jpg',
//             },
//             {
//                 issueId: issue2.id,
//                 imageUrl: 'https://example.com/images/profile-layout.jpg',
//             },
//         ],
//     });

//     // Create issue commands
//     await prisma.issueCommand.createMany({
//         data: [
//             {
//                 issueId: issue1.id,
//                 userId: developer1.id,
//                 text: 'I think this is related to the recent API changes.',
//                 likes: 2,
//                 replies: JSON.stringify([
//                     { userId: admin.id, text: 'I agree, let me check the API logs', timestamp: new Date() },
//                 ]),
//             },
//             {
//                 issueId: issue1.id,
//                 userId: regularUser.id,
//                 text: 'This is causing problems for our customers. Please prioritize!',
//                 likes: 0,
//                 replies: JSON.stringify([]),
//             },
//             {
//                 issueId: issue2.id,
//                 userId: developer2.id,
//                 text: 'I found the CSS issue causing this. Will fix soon.',
//                 likes: 1,
//                 replies: JSON.stringify([]),
//             },
//         ],
//     });

//     // Create notifications
//     await prisma.notification.createMany({
//         data: [
//             {
//                 id: 'notif-1',
//                 title: 'New Issue Assigned',
//                 message: 'You have been assigned to fix: Login page not working',
//                 type: 'assignment',
//                 userId: developer1.id,
//                 issueId: issue1.id,
//                 read: false,
//             },
//             {
//                 id: 'notif-2',
//                 title: 'New Issue Assigned',
//                 message: 'You have been assigned to fix: Profile page layout broken',
//                 type: 'assignment',
//                 userId: developer2.id,
//                 issueId: issue2.id,
//                 read: true,
//             },
//             {
//                 id: 'notif-3',
//                 title: 'New Comment',
//                 message: 'Regular User commented on your issue',
//                 type: 'comment',
//                 userId: developer1.id,
//                 issueId: issue1.id,
//                 read: false,
//             },
//             {
//                 id: 'notif-4',
//                 title: 'System Update',
//                 message: 'New version 2.3.0 is available',
//                 type: 'system',
//                 userId: admin.id,
//                 read: false,
//             },
//         ],
//     });

//     // Create accounts (for OAuth)
//     await prisma.account.createMany({
//         data: [
//             {
//                 userId: admin.id,
//                 type: 'oauth',
//                 provider: 'google',
//                 providerAccountId: 'google-123',
//             },
//             {
//                 userId: developer1.id,
//                 type: 'oauth',
//                 provider: 'github',
//                 providerAccountId: 'github-456',
//             },
//         ],
//     });

//     console.log('Database seeded successfully!');
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });