<template>
  <div class="base-layout">
    <nav v-if="$slots.nav">
      <slot name="nav" />
    </nav>
    <main>
      <div v-if="$slots.actionbar">
        <slot name="actionbar" />
      </div>
      <div class="content">
        <section class="main">
          <slot />
        </section>
        <aside v-if="$slots.sidebar">
          <slot name="sidebar" />
        </aside>
      </div>
    </main>
  </div>
</template>
