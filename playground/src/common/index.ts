import type { NameProps } from './nameProps'
import type { AgeProps } from './ageProps'

interface A {
  name: NameProps
  age: AgeProps
}

export type Props = A
