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
    export let form: any;

    let formData = {
        projectName: "",
        projectDescription: "",
        playableLink: "",
        githubLink: "",
        hackatimeProject: null as any,
        aiUsage: false,
        aiUsageDetails: "",
        uploadedImageUrl: ""
    };
    
    let uploadedImageUrl = "";
    let isUploading = false;
    let uploadError = "";
    let fileInputRef: HTMLInputElement;
    
    async function handleFileUpload(file: File) {
        if (!file) return;
        
        // Reset previous state
        uploadError = "";
        isUploading = true;
        
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: uploadFormData
            });
            
            const result = await response.json();
            
            if (result.success) {
                uploadedImageUrl = result.url;
                formData.uploadedImageUrl = result.url;
            } else {
                uploadError = result.error || 'Upload failed';
            }
        } catch (error) {
            uploadError = 'Network error during upload';
            console.error('Upload error:', error);
        } finally {
            isUploading = false;
        }
    }
    
    // Handle file input change
    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    }
    
    // Handle drag and drop
    function handleFileDrop(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            handleFileUpload(file);
        }
    }
    
    // Remove uploaded image
    function removeImage() {
        uploadedImageUrl = "";
        formData.uploadedImageUrl = "";
        uploadError = "";
        if (fileInputRef) {
            fileInputRef.value = "";
        }
    }
    
    // Form validation
    function validateForm() {
        const errors: string[] = [];
        
        if (!formData.projectName.trim()) {
            errors.push("Project Name is required");
        }
        
        if (!formData.projectDescription.trim()) {
            errors.push("Project Description is required");
        }
        
        if (!uploadedImageUrl) {
            errors.push("Project Screenshot is required");
        }
        
        if (!formData.playableLink.trim()) {
            errors.push("Playable Link is required");
        }
        
        if (!formData.githubLink.trim()) {
            errors.push("GitHub Link is required");
        }
        
        if (!formData.hackatimeProject) {
            errors.push("Hackatime Project selection is required");
        }
        
        if (formData.aiUsage && !formData.aiUsageDetails.trim()) {
            errors.push("AI Usage details are required when AI usage is checked");
        }
        
        return errors;
    }</script>
<div class="text-center">
    <h1 class="title">Product Submission - Project Info</h1>
    <form method="POST">
        <div class="w-full max-w-md text-center mx-auto">
  <Field.Set>
    <Field.Group>
      <Field.Field>
        <Field.Label for="projectName">Project Name *</Field.Label>
        <Input id="projectName" name="projectName" type="text" placeholder="Enter the name of your project" bind:value={formData.projectName} required />
      </Field.Field>
      <Field.Field>
        <Field.Label for="projectDescription">Project Description *</Field.Label>
        <Textarea id="projectDescription" name="projectDescription" placeholder="Describe your project in detail" bind:value={formData.projectDescription} required />
      </Field.Field>
      <Field.Field>
        <Field.Label>Project Screenshot *</Field.Label>
        
        {#if uploadedImageUrl}
          <!-- Show uploaded image -->
          <div class="space-y-4">
            <div class="border rounded-lg p-4 bg-green-50">
              <img 
                src={uploadedImageUrl} 
                alt="Uploaded project screenshot" 
                class="max-w-full h-auto max-h-64 mx-auto rounded-md"
              />
              <p class="text-sm text-green-600 mt-2 text-center">Image uploaded successfully!</p>
            </div>
            <div class="flex justify-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onclick={removeImage}
                type="button"
              >
                Remove Image
              </Button>
            </div>
          </div>
        {:else}
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
            on:dragover|preventDefault
            on:drop={handleFileDrop}
            on:click={() => fileInputRef?.click()}
            role="button"
            tabindex="0"
            on:keydown={(e) => e.key === 'Enter' && fileInputRef?.click()}
          >
            {#if isUploading}
              <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p class="text-gray-500">Uploading image...</p>
              </div>
            {:else}
              <div class="text-center">
                <p class="text-gray-500 mb-2">Click or drag images here to upload</p>
                <p class="text-xs text-gray-400">Supports JPG, PNG, GIF (max 10MB)</p>
              </div>
            {/if}
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            class="hidden" 
            bind:this={fileInputRef}
            on:change={handleFileChange}
          />
        {/if}
        
        {#if uploadError}
          <div class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{uploadError}</p>
          </div>
        {/if}
      </Field.Field>
<Separator class="my-4" />
    <Field.Field>
        <Field.Label for="playableLink">Playable Link *</Field.Label>
        <Input id="playableLink" name="playableLink" type="url" placeholder="Enter a link to a playable Web-app" bind:value={formData.playableLink} required />
    </Field.Field>
    <Field.Field>
        <Field.Label for="githubLink">GitHub Link *</Field.Label>
        <Input id="githubLink" name="githubLink" type="url" placeholder="Enter a link to your GitHub repository e.g., https://github.com/pkd2210/hello-world" bind:value={formData.githubLink} required />
    </Field.Field>
    <Separator class="my-4" />
    <Field.Field>
        <Field.Label for="hackatimeProject">Hackatime Project *</Field.Label>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <Button variant="outline" class="w-full">
                    {formData.hackatimeProject?.name || "Select a project"}
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {#each Object.values(data.projectListByName || {}) as project}
                    <DropdownMenu.Item onclick={() => formData.hackatimeProject = project}>{project.name} | {project.text}</DropdownMenu.Item>
                {/each}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </Field.Field>
    <Separator class="my-4" />
    <Field.Field>
        <Field.Label for="aiUsage">AI Usage</Field.Label>
        <Field.Description>Does your project was developed using AI in any way?</Field.Description>
        <Checkbox class="mr-2" id="aiUsage" name="aiUsage" bind:checked={formData.aiUsage} />
        {#if formData.aiUsage}
            <Field.Description>Please provide details about how AI was used in your project.</Field.Description>
                <Textarea id="aiUsageDetails" name="aiUsageDetails" placeholder="Describe how AI was used in your project" bind:value={formData.aiUsageDetails} required />

        {/if}
    </Field.Field>
    
    <input type="hidden" name="hackatimeProject" value={formData.hackatimeProject?.name || ''} />
    <input type="hidden" name="uploadedImageUrl" value={uploadedImageUrl} />
    
    {#if form?.errors}
        <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 class="text-red-800 font-semibold">Please fix the following errors:</h3>
            <ul class="mt-2 text-red-600">
                {#each form.errors as error}
                    <li>• {error}</li>
                {/each}
            </ul>
        </div>
    {/if}
    
    <Field.Field orientation="horizontal" class="justify-center space-x-2">
        <Button variant="outline" type="submit">Submit</Button>
        <Button variant="outline" type="button">Cancel</Button>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</div>
    </form>
</div>