<template>
    <div>
        <p>This is page B</p>
        <router-link :to="{name: 'over50'}" class="item">
            <button type="button">Go to Over50% issues page</button>
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