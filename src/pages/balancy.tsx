import { IconButton, SimpleGrid, Stack, useColorModeValue } from "@chakra-ui/react"
import AddBalancyRequirementCard from "components/balancy/AddBalancyRequirementCard"
import BalancyBar from "components/balancy/BalancyBar"
import BalancyFormCard from "components/balancy/BalancyFormCard"
import BalancyLogicPicker from "components/balancy/BalancyLogicPicker"
import Layout from "components/common/Layout"
import DynamicDevTool from "components/create-guild/DynamicDevTool"
import { TwitterLogo } from "phosphor-react"
import { FormProvider, useFieldArray, useForm } from "react-hook-form"
import { RequirementType } from "requirements"
import AllowlistForm from "requirements/Allowlist/AllowlistForm"
import NftForm from "requirements/Nft/NftForm"
import TokenForm from "requirements/Token/TokenForm"
import { Requirement } from "types"

const FORM_COMPONENTS = {
  ERC20: TokenForm,
  COIN: TokenForm,
  ALLOWLIST: AllowlistForm,
  ERC721: NftForm,
  ERC1155: NftForm,
  NOUNS: NftForm,
}

const Page = (): JSX.Element => {
  const methods = useForm({ mode: "all" })
  const { control, getValues } = methods

  const { fields, append, remove } = useFieldArray({
    name: "requirements",
    control,
  })

  const watchFieldArray = methods.watch("requirements")
  const controlledFields = fields.map((field, index) => ({
    ...field,
    ...watchFieldArray[index],
  }))

  const addRequirement = (type: RequirementType) => {
    append({
      type,
      address: null,
      data: {},
    })
  }

  const bgColor = useColorModeValue("gray.800", "whiteAlpha.200")

  return (
    <Layout
      title="Balancy playground"
      // image={<Icon boxSize={12} as={Cpu} mb="-6px" />}
      ogDescription="See how many addresses satisfy requirements and make allowlists out of them"
      background={bgColor}
      textColor="white"
      backgroundOffset={46}
      action={
        <IconButton
          as="a"
          target="_blank"
          colorScheme="alpha"
          href={"https://twitter.com/balancy_io"}
          rel="noopener"
          borderRadius={"full"}
          h="10"
          aria-label="Balancy twitter"
          icon={<TwitterLogo />}
        />
      }
    >
      <FormProvider {...methods}>
        <BalancyBar />
        <Stack spacing="6" pt="8">
          <BalancyLogicPicker />
          <SimpleGrid
            position="relative"
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 4, md: 5 }}
          >
            {controlledFields.map((field: Requirement, i) => {
              const type: RequirementType = getValues(`requirements.${i}.type`)
              const RequirementForm = FORM_COMPONENTS[type]
              if (RequirementForm) {
                return (
                  <BalancyFormCard
                    baseFieldPath={`requirements.${i}`}
                    type={type}
                    onRemove={() => remove(i)}
                    key={field.id}
                  >
                    <RequirementForm
                      field={field}
                      baseFieldPath={`requirements.${i}`}
                    />
                  </BalancyFormCard>
                )
              }
            })}
            <AddBalancyRequirementCard onAdd={addRequirement} />
          </SimpleGrid>
        </Stack>

        <DynamicDevTool control={methods.control} />
      </FormProvider>
    </Layout>
  )
}

export default Page
