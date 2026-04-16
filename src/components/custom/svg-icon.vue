<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'SvgIcon' });

/**
 * Props
 *
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 */
interface Props {
  /** Iconify icon name */
  icon?: string;
  /** Local svg icon name */
  localIcon?: string;
}

const props = defineProps<Props>();

const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;

  const defaultLocalIcon = 'no-icon';

  const icon = props.localIcon || defaultLocalIcon;

  return `#${prefix}-${icon}`;
});

/** If localIcon is passed, render localIcon first */
const renderLocalIcon = computed(() => props.localIcon || !props.icon);
</script>

<template>
  <span class="svg-icon-wrapper">
    <template v-if="renderLocalIcon">
      <svg aria-hidden="true" width="1em" height="1em">
        <use :xlink:href="symbolId" fill="currentColor" />
      </svg>
    </template>
    <Icon v-else-if="icon" :icon="icon" />
  </span>
</template>

<style scoped>
.svg-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit !important;
}

.svg-icon-wrapper :deep(*) {
  color: currentColor !important;
}

.svg-icon-wrapper :deep(.iconify--ph) {
  color: currentColor !important;
}

.svg-icon-wrapper svg {
  color: currentColor !important;
}
</style>
