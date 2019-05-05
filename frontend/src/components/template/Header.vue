<template>
    <header class="header">
        <img class="logo" src="../../assets/logo.png"/>
        <h1 class="title">
            <router-link to="/">{{ title }}</router-link>
        </h1>
        <UserDropdown v-if="!hideUserDropdown" />
    </header>
</template>

<script>
import UserDropdown from './UserDropdown'

export default {
    name: 'Header',
    components: { UserDropdown },
    props: {
        title: String,
        hideToggle: Boolean,
        hideUserDropdown: Boolean
    }
}
</script>

<style>
    .header {
        grid-area: header;
        background: linear-gradient(to right, rgba(225,249,247,1) 0%, rgba(176,236,240,1) 34%, rgba(143,227,235,1) 57%, rgba(102,216,229,1) 86%, rgba(102,216,229,1) 100%);
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
    }

    .logo {
        width: 240px;
        height: 60px;
    }

    .title {
        padding-left: 10px;
        font-size: 1.2rem;
        color: #0094a1;
        font-weight: 100;
        flex-grow: 1;
        text-align: left;
        margin: 0px;
    }

    .title a {
        color: #0094a1;
        text-decoration: none;
    }

    .title a:hover {
        color: #0094a1;
        text-decoration: none;
    }

    header.header > a.toggle {
        width: 60px;
        height: 100%;
        color: #0094a1;
        justify-self: flex-start;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    header.header > a.toggle:hover {
        color: #0094a1;
    }
</style>
