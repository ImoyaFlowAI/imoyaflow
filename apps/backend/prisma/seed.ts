import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'demo_tenant' },
    update: {},
    create: {
      id: 'demo_tenant',
      name: 'Demo Tenant',
    },
  });

  console.log('✅ Created demo tenant');

  // Create sample form
  const form = await prisma.form.upsert({
    where: { id: 'demo_lead_form' },
    update: {},
    create: {
      id: 'demo_lead_form',
      title: 'Lead Capture Form',
      schemaJson: {
        id: 'demo_lead_form',
        title: 'Lead Capture Form',
        description: 'Get in touch with us and we\'ll reach out soon!',
        fields: [
          {
            id: 'name',
            type: 'text',
            label: 'Full Name',
            required: true,
            placeholder: 'Enter your full name'
          },
          {
            id: 'email',
            type: 'email',
            label: 'Email Address',
            required: true,
            placeholder: 'Enter your email'
          },
          {
            id: 'company',
            type: 'text',
            label: 'Company',
            required: false,
            placeholder: 'Your company name'
          },
          {
            id: 'message',
            type: 'textarea',
            label: 'Message',
            required: false,
            placeholder: 'Tell us about your project'
          }
        ]
      },
      tenantId: tenant.id,
    },
  });

  console.log('✅ Created sample form');

  // Create sample automations
  await prisma.automation.createMany({
    data: [
      {
        id: 'demo_email_automation',
        type: 'send_email',
        configJson: {
          fromCredentialId: 'cred:gmail:demo',
          subject: 'Thanks for your interest, {{name}}!',
          message: 'Hi {{name}},\n\nThank you for reaching out! We\'ll review your message and get back to you within 24 hours.\n\nBest regards,\nThe Team'
        },
        formId: form.id,
      },
      {
        id: 'demo_sheet_automation',
        type: 'append_sheet',
        configJson: {
          sheetCredentialId: 'cred:gsheets:demo',
          docId: '1AbC...',
          sheetName: 'Leads'
        },
        formId: form.id,
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample automations');

  // Create sample credentials
  await prisma.credential.createMany({
    data: [
      {
        id: 'demo_gmail_cred',
        provider: 'gmail',
        label: 'Demo Gmail Account',
        encryptedJson: 'encrypted_oauth_token_here',
        tenantId: tenant.id,
      },
      {
        id: 'demo_sheets_cred',
        provider: 'gsheets',
        label: 'Demo Google Sheets',
        encryptedJson: 'encrypted_oauth_token_here',
        tenantId: tenant.id,
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Created sample credentials');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
