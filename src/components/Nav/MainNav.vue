<script setup lang="ts">
import Logo from '~/assets/logo.svg'
import { useAppStore } from '~/stores'
import { renderIcon } from '~/utils'

const appStroe = useAppStore()
const { isMenuCollapsed, themeAuto, themeType } = storeToRefs(appStroe)
const router = useRouter()

const themeOptions = computed(() => [
  {
    label: themeType.value === 'light' ? '深色模式' : '浅色模式',
    key: 'lightTodark',
    icon: renderIcon(themeType.value === 'light' ? 'i-ph-sun-bold' : 'i-ph-moon-stars-bold'),
  },
  {
    label: '程序设置',
    key: 'setting',
    icon: renderIcon('i-ph-gear-six-bold'),
  },
])

function themeChange(key: string) {
  switch (key) {
    case 'lightTodark': {
      themeType.value = themeType.value === 'dark' ? 'light' : 'dark'
      window.$message.info(`已切换至${themeType.value === 'light' ? '浅色' : '深色'}模式`, { showIcon: false })
      themeAuto.value = false
      break
    }
    case 'setting': {
      router.push('/Setting')
      break
    }
    default:
      break
  }
}
</script>

<template>
  <nav flex="~" h15 wfull select-none items-center style="-webkit-app-region: drag;">
    <div flex="~" cursor-pointer items-center :class="isMenuCollapsed ? null : 'w60'" @click="router.push('/')">
      <div hfull w16 flex="~ center" style="-webkit-app-region: no-drag">
        <n-avatar
          size="medium"
          :src="Logo"
          hover="transform scale-120 transition-transform duration-500"
          style="--n-color: transparent"
        />
      </div>
      <h1 v-if="!isMenuCollapsed" text-2xl font-600 style="-webkit-app-region: no-drag">
        GioPic
      </h1>
    </div>
    <div flex="~" items-center style="-webkit-app-region: no-drag">
      <n-button :focusable="false" quaternary mr2 h8 w8 rounded-1.5 @click="router.go(-1)">
        <template #icon>
          <div i-ph-caret-left-bold />
        </template>
      </n-button>
      <n-button :focusable="false" quaternary h8 w8 @click="router.go(1)">
        <template #icon>
          <div i-ph-caret-right-bold />
        </template>
      </n-button>
    </div>

    <div mla flex="~" style="-webkit-app-region: no-drag">
      <div>
        <n-dropdown :options="themeOptions" trigger="click" @select="themeChange">
          <n-button :focusable="false" quaternary h8 w8>
            <template #icon>
              <div i-ph-gear-six-bold />
            </template>
          </n-button>
        </n-dropdown>
      </div>
      <TitleBar />
    </div>
  </nav>
</template>
