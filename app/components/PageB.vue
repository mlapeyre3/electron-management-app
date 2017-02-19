<template>
    <div>
        <p>This is page B</p>
        <router-link :to="{name: 'pageA'}" class="item">
            <button type="button">Go to pageA</button>
        </router-link>
    </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    }
  }
</script>