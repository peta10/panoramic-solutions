import { generateOrganizationSchema, generatePersonSchema } from '@/shared/utils/seo'

export function StructuredData() {
  const organizationSchema = generateOrganizationSchema()
  const personSchema = generatePersonSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
    </>
  )
}
