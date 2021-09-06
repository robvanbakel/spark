<template>
  <div class="lds-ellipsis">
    <div id="e1"></div>
  </div>
</template>

<style scoped>
.lds-ellipsis {
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  width: 13px;
  height: 13px;
  background: #fff;
}

#e1 {
  animation: lds-ellipsis1 600ms infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
