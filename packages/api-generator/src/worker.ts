import fs from 'fs/promises'
import path from 'path'
import { kebabCase } from './helpers/text'
import { generateComponentDataFromTypes } from './types'
import { addDescriptions, addPropData } from './utils'
import mkdirp from 'mkdirp'
import { parseSassVariables } from './helpers/sass'

export default async (json: string) => {
  const { componentName, componentProps, locales, outPath } = JSON.parse(json)

  console.log(componentName)

  try {
    const kebabName = kebabCase(componentName)
    const componentData = await generateComponentDataFromTypes(componentName)

    const sources = addPropData(kebabName, componentData as any, componentProps)

    addDescriptions(kebabName, componentData as any, sources, locales)

    const sass = parseSassVariables(componentName)

    await mkdirp(outPath)

    await fs.writeFile(path.resolve(outPath, `${kebabName}.json`), JSON.stringify({ ...componentData, sass }, null, 2))

    return { componentName, kebabName, ...componentData }
  } catch (err) {
    console.error(`${componentName}: ${err}`, err.stack)
    return null
  }
}