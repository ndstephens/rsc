import { faker } from '@faker-js/faker';

import { prisma } from '../lib/prisma';

faker.seed(123);

async function main() {
  for (let i = 0; i < 1000; i++) {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({
          firstName,
          lastName,
        }),
      },
    });
  }
}

main();
