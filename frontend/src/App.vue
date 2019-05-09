<template>
	<div id="app" :class="[{'auth': auth}]">
		<Header v-if="!auth" title="EasyContract - A tecnologia a seu favor" 
			:hideToggle="!user"
			:hideUserDropdown="!user" />
		<Loading v-if="validatingToken" />
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "@/global"
import { mapState } from "vuex"

import Header from "@/components/template/Header"
import Content from "@/components/template/Content"
import Footer from "@/components/template/Footer"
import Loading from "@/components/template/Loading"

export default {
	name: "App",
	components: { Header, Content, Footer, Loading },
	computed: mapState(['user', 'auth']),
	data: function() {
		return {
			validatingToken: true
		}
	},
	methods: {
		async validateToken() {
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			
			this.$store.commit('setUser', null)

			if(!userData) {
				this.validatingToken = false
				this.$router.push({ name: 'auth' })

				return
			}

			const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

			if (res.data) {
				this.$store.commit('setUser', userData)
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
}

</script>

<style>
	body {
		margin: 0;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		
		height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns:1fr;
		grid-template-areas:
			"header"
			"content"
			"footer";
	}

	#app.auth {
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
		grid-template-areas:
			"content";
	}
</style>