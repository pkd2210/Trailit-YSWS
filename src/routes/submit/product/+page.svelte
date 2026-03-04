<script lang="ts">
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import * as FileDropZone from "$lib/components/ui/file-drop-zone";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";    

    interface DataType {
        user: any;
        isAdmin: boolean;
        userTokens: number;
        userRecordId: string | null;
        projectListByName: Record<string, { name: string }>;
    }
    
    export let data: DataType;
    let aiUsageChecked = false;
</script>
<div class="text-center">
    <h1 class="title">Product Submission - Project Info</h1>
    <form>
        <div class="w-full max-w-md text-center mx-auto">
  <Field.Set>
    <Field.Group>
      <Field.Field>
        <Field.Label for="projectName">Project Name</Field.Label>
        <Input id="projectName" type="text" placeholder="Enter the name of your project" />
      </Field.Field>
      <Field.Field>
        <Field.Label for="projectDescription">Project Description</Field.Label>
        <Textarea id="projectDescription" placeholder="Describe your project in detail" />
      </Field.Field>
      <FileDropZone.Root>
	<FileDropZone.Trigger>
        <Field.Field>
            <Field.Label>Project Screenshot</Field.Label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer">
                <p class="text-gray-500">Click or drag files here to upload the screenshot</p>
            </div>
        </Field.Field>
	</FileDropZone.Trigger>
</FileDropZone.Root>
<Separator class="my-4" />
    <Field.Field>
        <Field.Label for="playableLink">Playable Link</Field.Label>
        <Input id="playableLink" type="url" placeholder="Enter a link to a playable Web-app" />
    </Field.Field>
    <Field.Field>
        <Field.Label for="githubLink">GitHub Link</Field.Label>
        <Input id="githubLink" type="url" placeholder="Enter a link to your GitHub repository e.g., https://github.com/pkd2210/hello-world" />
    </Field.Field>
    <Separator class="my-4" />
    <Field.Field>
        <Field.Label for="hackatimeProject">Hackatime Project</Field.Label>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="outline" class="w-full">
                    Select a project
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each Object.values(data.projectListByName || {}) as project}
                    <DropdownMenu.Item>{project.name}</DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Field.Field>
    <Separator class="my-4" />
    <Field.Field>
        <Field.Label for="aiUsage">AI Usage</Field.Label>
        <Field.Description>Does your project was developed using AI in any way?</Field.Description>
        <Checkbox class="mr-2" id="aiUsage" bind:checked={aiUsageChecked} />
        {#if aiUsageChecked}
            <Field.Description>Please provide details about how AI was used in your project.</Field.Description>
                <Textarea id="aiUsageDetails" placeholder="Describe how AI was used in your project" />

        {/if}
    </Field.Field>
    <Field.Field orientation="horizontal" class="justify-center space-x-2">
        <Button variant="outline" type="submit">Next</Button>
        <Button variant="outline" type="button">Cancel</Button>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</div>
    </form>
</div>