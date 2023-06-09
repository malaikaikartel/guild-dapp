import { numberInputAnatomy as parts } from "@chakra-ui/anatomy"
import { PartsStyleObject } from "@chakra-ui/react"
import Input from "./input"

const { variants, defaultProps } = Input

type Size = "xs" | "sm" | "md" | "lg"

function getSize(size: Size): PartsStyleObject<typeof parts> {
  const sizeStyle = Input.sizes[size]

  const radius: Record<Size, string> = {
    lg: "xl",
    md: "lg",
    sm: "lg",
    xs: "md",
  }

  return {
    field: {
      ...sizeStyle.field,
    },
    stepper: {
      _first: {
        borderTopEndRadius: radius[size],
      },
      _last: {
        borderBottomEndRadius: radius[size],
      },
    },
  }
}

const sizes = {
  xs: getSize("xs"),
  sm: getSize("sm"),
  md: getSize("md"),
  lg: getSize("lg"),
}

const styles = {
  parts: parts.keys,
  sizes,
  variants,
  defaultProps,
}

export default styles
