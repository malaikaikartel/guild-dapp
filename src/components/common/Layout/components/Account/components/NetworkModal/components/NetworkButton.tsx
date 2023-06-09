import { Img, Tooltip } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Button from "components/common/Button"
import { Chains, RPC } from "connectors"

type Props = {
  chain: string
  requestNetworkChange: () => void
}

const NetworkButton = ({ chain, requestNetworkChange }: Props) => {
  const { chainId } = useWeb3React()

  const isCurrentChain = Chains[chain] === chainId

  return (
    <Tooltip
      isDisabled={!isCurrentChain}
      label={`${RPC[chain].chainName} is currently selected`}
      shouldWrapChildren
    >
      <Button
        leftIcon={
          <Img
            src={RPC[chain].iconUrls[0]}
            boxSize={6}
            alt={`${RPC[chain].chainName} logo`}
          />
        }
        border={isCurrentChain && "2px"}
        borderColor="primary.500"
        borderRadius={"xl"}
        isDisabled={isCurrentChain}
        onClick={requestNetworkChange}
        w="full"
        size={"xl"}
        iconSpacing={5}
        px={5}
        justifyContent="start"
      >
        {RPC[chain].chainName}
      </Button>
    </Tooltip>
  )
}

export default NetworkButton
