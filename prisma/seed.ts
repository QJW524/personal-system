import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteProfile.upsert({
    where: { id: 1 },
    update: {
      siteTitle: 'Qiu 的个人系统',
      tagline: '记录我做过的事，而不是套模板的自我介绍。',
    },
    create: {
      id: 1,
      siteTitle: 'Qiu 的个人系统',
      tagline: '记录我做过的事，而不是套模板的自我介绍。',
      highlights: {
        create: [
          {
            title: '系统化习惯追踪',
            summary: '把学习、输出和复盘拆成可执行动作，每周迭代一次。',
          },
          {
            title: '自动化部署实践',
            summary: '用 Docker 和 GitHub Actions 减少重复运维操作。',
          },
        ],
      },
    },
    include: {
      highlights: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
