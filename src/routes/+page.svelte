<script>
    import config from '$lib/stores/config.json';

</script>

<div class="center">
    <div class="title">Welcome to {config["ysws-name"]}'s Shop</div>
    <p class="subtitle">{config["ysws-description"]}</p>
    <a href="https://auth.hackclub.com/oauth/authorize?client_id={config["hca-client-id"]}&redirect_uri=http://localhost:5173/api/callback&response_type=code&scope=email+name+slack_id+verification_status"><button class="login-button">Login</button></a>
</div>

