const parseFromObject = (obj, path) => {
  if (!path) return obj
  return path.split(".").reduce((accObj, currKey) => accObj?.[currKey], obj)
}

export default parseFromObject
