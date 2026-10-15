import { roleLabels } from '../../lib/roles'
import type { Role } from '../../types'

export const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({
  value: value as Role,
  label,
}))