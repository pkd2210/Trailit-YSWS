<script>
    import config from '$lib/stores/config.json';
    
    export let project;
</script>

<div>
    <p style="color: {config['theme-color']}">Project: {project.fields['Project Name']}</p>
    <p style="color: {config['theme-color']}">Description: {project.fields['Description']}</p>
    <p style="color: {config['theme-color']}">Status: {project.fields['Fulfilled?']}</p>
</div>