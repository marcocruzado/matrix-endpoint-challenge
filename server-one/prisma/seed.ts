import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear roles por defecto
  const roles = [
    {
      name: 'ADMIN',
      description: 'Administrador del sistema con acceso total'
    },
    {
      name: 'USER',
      description: 'Usuario regular con acceso a operaciones básicas'
    },
    {
      name: 'GUEST',
      description: 'Usuario con acceso limitado'
    }
  ];

  console.log('📝 Creando roles por defecto...');
  
  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name }
    });

    if (!existingRole) {
      await prisma.role.create({
        data: role
      });
      console.log(`✅ Rol ${role.name} creado exitosamente`);
    } else {
      console.log(`ℹ️ El rol ${role.name} ya existe`);
    }
  }

  console.log('✨ Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 