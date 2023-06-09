import { BigNumberish } from "@ethersproject/bignumber"
import { ContractInterface } from "@ethersproject/contracts"
import { Chain, RPC } from "connectors"
import { RequirementType } from "requirements"
import GUILD_PIN_ABI from "static/abis/guildPin.json"
import OLD_TOKEN_BUYER_ABI from "static/abis/oldTokenBuyerAbi.json"
import TOKEN_BUYER_ABI from "static/abis/tokenBuyerAbi.json"
import {
  encodePermit2Permit,
  encodeUnwrapEth,
  encodeV2SwapExactOut,
  encodeV3SwapExactOut,
  encodeWrapEth,
  UNIVERSAL_ROUTER_COMMANDS,
} from "./encoders"

export type TokenBuyerContractConfig = Partial<
  Record<
    Chain,
    {
      address: string
      abi: object
    }
  >
>

export const ZEROX_SUPPORTED_SOURCES = ["Uniswap_V2", "Uniswap_V3"] as const
export type ZeroXSupportedSources = (typeof ZEROX_SUPPORTED_SOURCES)[number]

export const GUILD_FEE_PERCENTAGE = 0.01

export const ADDRESS_REGEX = /^0x[A-F0-9]{40}$/i
export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"

const DEFAULT_TOKEN_BUYER_CONTRACTS: TokenBuyerContractConfig = {
  ETHEREUM: {
    address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
    abi: TOKEN_BUYER_ABI,
  },
  POLYGON: {
    address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
    abi: TOKEN_BUYER_ABI,
  },
  ARBITRUM: {
    address: "0xe6e6b676f94a6207882ac92b6014a391766fa96e",
    abi: OLD_TOKEN_BUYER_ABI,
  },
  // BSC: {
  //   address: "0xde0d301c75779423d962c2e538d0f326004e7c83",
  //   abi: TOKEN_BUYER_ABI,
  // },
  GOERLI: {
    address: "0x1eeaab336061d64f1d271eed529991f7ae7cc478",
    abi: TOKEN_BUYER_ABI,
  },
}

const SPECIAL_TOKEN_BUYER_CONTRACTS: Record<number, TokenBuyerContractConfig> = {
  // Alongside - TODO
  // 7635: {
  //   ...DEFAULT_TOKEN_BUYER_CONTRACTS,
  //   ETHEREUM: {
  //     address: "0x4aff02d7aa6be3ef2b1df629e51dcc9109427a07",
  //     abi: TOKEN_BUYER_ABI,
  //   },
  //   POLYGON: {
  //     address: "0x151c518390d38487a4ddcb02e3f156a77c184cb9",
  //     abi: TOKEN_BUYER_ABI,
  //   },
  // },
}

export const getTokenBuyerContractData = (
  guildId?: number
): TokenBuyerContractConfig =>
  SPECIAL_TOKEN_BUYER_CONTRACTS[guildId] ?? DEFAULT_TOKEN_BUYER_CONTRACTS

export const ZEROX_API_URLS: Partial<Record<Chain, string>> = {
  ETHEREUM: "https://api.0x.org",
  GOERLI: "https://goerli.api.0x.org",
  POLYGON: "https://polygon.api.0x.org",
  // BSC: "https://bsc.api.0x.org",
  // OPTIMISM: "https://optimism.api.0x.org",
  // FANTOM: "https://fantom.api.0x.org",
  // CELO: "https://celo.api.0x.org",
  // AVALANCHE: "https://avalanche.api.0x.org",
  ARBITRUM: "https://arbitrum.api.0x.org",
}

export const RESERVOIR_API_URLS: Partial<Record<Chain, string>> = {
  // ETHEREUM: "https://api.reservoir.tools",
  // GOERLI: "https://api-goerli.reservoir.tools",
  // POLYGON: "https://api-polygon.reservoir.tools",
  // OPTIMISM: "https://api-optimism.reservoir.tools",
}

export const purchaseSupportedChains: Partial<Record<RequirementType, string[]>> = {
  ERC20: Object.keys(ZEROX_API_URLS),
  ERC721: Object.keys(RESERVOIR_API_URLS),
  ERC1155: Object.keys(RESERVOIR_API_URLS),
}

export const allPurchaseSupportedChains: Chain[] = [
  ...new Set(Object.values(purchaseSupportedChains).flat()),
] as Chain[]

export const PURCHASABLE_REQUIREMENT_TYPES: RequirementType[] = [
  "ERC20",
  "ERC721",
  "ERC1155",
]

export const SUPPORTED_CURRENCIES: { chainId: number; address: string }[] = [
  // Add native currencies automatically
  ...allPurchaseSupportedChains.map((c) => ({
    chainId: RPC[c].chainId,
    address: RPC[c].nativeCurrency.symbol,
  })),
  /**
   * We'll be able to add ERC20 tokens here in the following format:
   *
   * { chainId: number, address: string (token address) }
   */
]

export type PurchaseAssetData = {
  chainId: number
  account: string
  tokenAddress: string
  amountIn: BigNumberish // amount which we got back from the 0x API (in WEI)
  amountInWithFee: BigNumberish // amount which we got back from the 0x API + Guild fee (in WEI)
  amountOut: BigNumberish // token amount which we'd like to purchase (in WEI)
  source: ZeroXSupportedSources
  path: string
  tokenAddressPath: string[]
}

export type BuyTokenType = "COIN" | "ERC20"

export const permit2PermitFakeParams: [
  string,
  number,
  number,
  string,
  string,
  string
] = [
  "1461501637330902918203684832716283019655932542975",
  1706751423,
  0,
  "0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5",
  "1704161223",
  "0x00",
]

const {
  WRAP_ETH,
  UNWRAP_WETH,
  V2_SWAP_EXACT_OUT,
  V3_SWAP_EXACT_OUT,
  PERMIT2_PERMIT,
} = UNIVERSAL_ROUTER_COMMANDS

export const getAssetsCallParams: Record<
  BuyTokenType,
  Record<
    ZeroXSupportedSources,
    {
      commands: string
      getEncodedParams: (data: PurchaseAssetData) => string[]
    }
  >
> = {
  COIN: {
    Uniswap_V2: {
      commands: WRAP_ETH + V2_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, tokenAddressPath }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
        encodeUnwrapEth(account, 0),
      ],
    },
    Uniswap_V3: {
      commands: WRAP_ETH + V3_SWAP_EXACT_OUT + UNWRAP_WETH,
      getEncodedParams: ({ account, amountIn, amountOut, path }) => [
        encodeWrapEth("0x0000000000000000000000000000000000000002", amountIn),
        encodeV3SwapExactOut(account, amountOut, amountIn, path, false),
        encodeUnwrapEth(account, 0),
      ],
    },
  },
  ERC20: {
    Uniswap_V2: {
      commands: PERMIT2_PERMIT + V2_SWAP_EXACT_OUT,
      getEncodedParams: ({
        account,
        amountIn,
        amountOut,
        tokenAddress,
        tokenAddressPath,
      }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV2SwapExactOut(account, amountOut, amountIn, tokenAddressPath, false),
      ],
    },
    Uniswap_V3: {
      commands: PERMIT2_PERMIT + V3_SWAP_EXACT_OUT,
      getEncodedParams: ({ account, amountIn, amountOut, path, tokenAddress }) => [
        encodePermit2Permit(tokenAddress, ...permit2PermitFakeParams),
        encodeV3SwapExactOut(account, amountOut, amountIn, path, false),
      ],
    },
  },
}

export const FEE_COLLECTOR_CONTRACT: Partial<Record<Chain, string>> = {
  ETHEREUM: "0xe4b4c6a7c6b6396032096C12aDf46B7F14a70F4d",
  POLYGON: "0xe4b4c6a7c6b6396032096C12aDf46B7F14a70F4d",
  POLYGON_MUMBAI: "0xe4b4c6a7c6b6396032096C12aDf46B7F14a70F4d",
}
export const paymentSupportedChains: Chain[] = Object.keys(
  FEE_COLLECTOR_CONTRACT
) as Chain[]

type GuildPinContracts = Partial<
  Record<Chain, { address: string; abi: ContractInterface }>
>

const GUILD_PIN_CONTRACTS = {
  DEFAULT: {
    // POLYGON_MUMBAI: {
    //   address: "0x807f16eba4a2c51b86cb8ec8be8eab34305c2bfd",
    //   abi: GUILD_PIN_ABI,
    // },
    POLYGON: {
      address: "0xff04820c36759c9f5203021fe051239ad2dcca8a",
      abi: GUILD_PIN_ABI,
    },
  },
  // Sybil-test
  32076: {
    BSC: {
      address: "0x807f16eba4a2c51b86cb8ec8be8eab34305c2bfd",
      abi: GUILD_PIN_ABI,
    },
  },
  // Linea
  32319: {
    BSC: {
      address: "0x807f16eba4a2c51b86cb8ec8be8eab34305c2bfd",
      abi: GUILD_PIN_ABI,
    },
  },
  // Arbitrum
  9839: {
    ARBITRUM: {
      address: "0x0e6a14106497a7de36fba446628860c062e9e302",
      abi: GUILD_PIN_ABI,
    },
  },
  // Alpha Venture DAO
  17326: {
    ARBITRUM: {
      address: "0x0e6a14106497a7de36fba446628860c062e9e302",
      abi: GUILD_PIN_ABI,
    },
  },
}
// TODO: satisfies Partial<Record<Chain, { address: string; abi: ContractInterface }>> - we just can't use it in Next.js 12, but we should add it later.

export type GuildPinsSupportedChain =
  keyof typeof GUILD_PIN_CONTRACTS extends infer Keys
    ? Keys extends keyof typeof GUILD_PIN_CONTRACTS
      ? keyof (typeof GUILD_PIN_CONTRACTS)[Keys]
      : never
    : never

export const getGuildPinContracts = (guildId?: number): GuildPinContracts => {
  if (!guildId) return GUILD_PIN_CONTRACTS.DEFAULT
  return GUILD_PIN_CONTRACTS[guildId] ?? GUILD_PIN_CONTRACTS.DEFAULT
}

export const flattenedGuildPinChainsData = Object.fromEntries(
  Object.values(GUILD_PIN_CONTRACTS).map((entry) => Object.entries(entry).flat())
)
