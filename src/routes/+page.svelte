<script>
    import config from '$lib/stores/config.json';
    let { data } = $props();
</script>
 
<div class="center">
    <!-- edit Those to fit your project -->
         <svg class="hero-svg" style="fill: #3c4858;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><circle cx="50%" cy="50%" r="240" fill="#ec3750" /><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><g transform="translate(320, 320) scale(0.6) translate(-320, -320)"><path d="M512 128C514 128 515.9 128.1 517.8 128.3L422.1 224L490 224L562 152C570.8 163 576 176.9 576 192L576 448C576 483.3 547.3 512 512 512L128 512C92.7 512 64 483.3 64 448L64 192C64 156.7 92.7 128 128 128L198.1 128L102.1 224L170 224L265 129L266 128L358.1 128L262.1 224L330 224L425 129L426 128L512.1 128z"/></g></svg>
    <div class="title">Welcome to {config["ysws-name"]}'s Shop</div>
    <p class="subtitle" style="text-align: center;">You Ship: Web app and a trailer or a video, showcasing your project<br>We Ship: Filming, editing, and recording equipment</p>
    <!--End of the editing section-->
    <button class="slack-button"><a href="https://hackclub.enterprise.slack.com/archives/C0AGG8J6PLL" target="_blank">#trailit-ysws</a></button>
    <style>
        .hero-svg {
            transition: transform 0.3s ease;
        }
        .hero-svg:hover {
            transform: scale(1.05);
        }
        .slack-button {
            top: 20px;
            background-color: #ab2739;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
        }
        .slack-button a {
            color: white;
            text-decoration: none;
        }
        .slack-button:hover {
            background-color: #801f2c;
        }
        .demo-button {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 1rem;
        }
        .demo-button:hover {
            background-color: #5a6268;
        }
        </style>
    <!--End of the editing section-->
    <br>
    {#if data.user}
        <a href="{config['url-base']}/shop"><button class="login-button">Go to Shop</button></a>
    {:else}
        <a href="/api/login"><button class="login-button">Login</button></a>
        <br>
        <!-- <a href="/api/demo-login"><button class="demo-button">Try Demo</button></a> -->
    {/if}
</div>

