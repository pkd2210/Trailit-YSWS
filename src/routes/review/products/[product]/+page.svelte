<script>
  import { page } from '$app/stores';
  import { Button } from "$lib/components/ui/button";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import Separator from '$lib/components/ui/separator/separator.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';

  const id = $derived($page.params.product);


  let approved = $state(false);
  let rejected = $state(false);

  const { data } = $props();
  const product = $derived(data.product);

  let Styling = $state(0);
  let Functionality = $state(0);
  let EaseOfUse = $state(0);
  let Needeness = $state(0);
  let Bonus = $state(0);

  let RejectionReason = $state('');
  let HoursJustification = $state('');
  let submitterUsername = $state(null);
  let loadingUsername = $state(false);

  let Hours = $derived(product?.fields["Hours"] || 0);
  
  onMount(() => {
    if (browser && product?.fields["SlackID"]) {
      loadingUsername = true;
      fetch('https://cachet.dunkirk.sh/users/' + product.fields["SlackID"])
        .then(res => res.json())
        .then(user => {
          submitterUsername = user;
          loadingUsername = false;
        })
        .catch(() => {
          submitterUsername = null;
          loadingUsername = false;
        });
    }
  });

  function confirmApproval() {
    // Form submission will handle the approval
    approved = false;
  }

  function confirmRejection() {
    // Form submission will handle the rejection  
    rejected = false;
  }
</script>

<div class="flex flex-col gap-4">
    <section class="flex flex-col items-center justify-center gap-4">
        <div class="title">Project {id} - Product Review</div>
    </section>
    <div class="flex justify-center">
        <div class="rounded-lg border bg-card shadow-sm w-full max-w-md p-6 space-y-4">
            <div>
                <h3 class="text-lg font-semibold">Project Name: {product?.fields["Product Name"] || 'Unnamed Product'}</h3>
                <p class="text-sm text-muted-foreground">GitHub Repo: <a href="{String(product?.fields["Code URL"] || '#')}" target="_blank" rel="noopener noreferrer" class="underline">{product?.fields["Code URL"] || 'No repository available.'}</a></p>
                <p class="text-sm text-muted-foreground">Playable Link: <a href="{String(product?.fields["Playable URL"] || '#')}" target="_blank" rel="noopener noreferrer" class="underline">{product?.fields["Playable URL"] || 'No playable link available.'}</a></p>
            </div>
            
            <div class="space-y-4">
                <p>Project Description: {product?.fields["Description"] || 'No description available.'}</p>
                <div class="text-sm text-muted-foreground">
                    <p>Submitter ID: @{product?.fields["SlackID"]}</p>
                    {#if loadingUsername}
                        <p>Submitter Username: Loading...</p>
                    {:else if submitterUsername}
                        <p>Submitter Username: {submitterUsername.displayName || 'Unknown'}</p>
                    {:else}
                        <p>Submitter Username: Failed to load</p>
                    {/if}
                </div>
                <br>
                <a href="https://joe.fraud.hackclub.com/profile/{product?.fields["SlackID"]}" target="_blank" rel="noopener noreferrer" class="underline">Hackatime Project: {product?.fields["Hackatime project"] || 'No project available.'}</a>
                <p class="text-sm">Hours: {product?.fields["Hours"] || 'No hours available.'}</p>
            </div>
            
            <div class="flex flex-col gap-2 pt-4">
                <Button onclick={() => (approved = true)} class="w-full" variant="outline" >Approve Product</Button>
                <AlertDialog.Root bind:open={approved}>
                  <AlertDialog.Content>
                      <AlertDialog.Header>
                          <AlertDialog.Title>Confirm Product Approval</AlertDialog.Title>
                          <AlertDialog.Description>
                              Are you sure you want to approve "{product?.fields["Product Name"] || 'this product'}"?
                          </AlertDialog.Description>
                      </AlertDialog.Header>
                      <div class="p-4">
                        <label for="styling-amount-input" class="block text-sm font-medium mb-2">Styling (0 - 2):</label>
                        <input id="styling-amount-input"type="number" bind:value={Styling} min="0" max="2" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"placeholder="0 - 2"/>
                        <label for="functionality-amount-input" class="block text-sm font-medium mb-2">Functionality (0 - 3):</label>
                        <input id="functionality-amount-input"type="number" bind:value={Functionality} min="0" max="3" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"placeholder="0 - 3"/>
                        <label for="ease-of-use-amount-input" class="block text-sm font-medium mb-2">Ease Of Use (0 - 3):</label>
                        <input id="ease-of-use-amount-input"type="number" bind:value={EaseOfUse} min="0" max="3" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"placeholder="0 - 3"/>
                        <label for="needeness-amount-input" class="block text-sm font-medium mb-2">Needeness (0 - 2):</label>
                        <input id="needeness-amount-input"type="number" bind:value={Needeness} min="0" max="2" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"placeholder="0 - 2"/>
                        <label for="bonus-amount-input" class="block text-sm font-medium mb-2">Bonus (0 - 3):</label>
                        <input id="bonus-amount-input"type="number" bind:value={Bonus} min="0" max="3" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"placeholder="0 - 3"/>
                        <Separator class="my-4" />
                        <p>Total Score: {Styling + Functionality + EaseOfUse + Needeness + Bonus} / 13</p>
                        <Separator class="my-4" />
                        <label for="hours" class="block text-sm font-medium mb-2">Hours:</label>
                        <input id="hours"type="number" bind:value={Hours} min="0" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"placeholder="0"/>
                        <Separator class="my-4" />
                        <label for="hours-justification" class="block text-sm font-medium mb-2">Hours Justification:</label>
                        <textarea id="hours-justification" bind:value={HoursJustification} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Provide justification for the hours awarded" rows="3"></textarea>
                      </div>
                      <AlertDialog.Footer>
                          <AlertDialog.Cancel onclick={() => (approved = false)} style="cursor: pointer;">Cancel</AlertDialog.Cancel>
                          <form method="POST" action="?/approve" use:enhance={() => {
                            return ({ result }) => {
                              approved = false;
                              if (result.type === 'success') {
                                goto('/review/products');
                              }
                            };
                          }}>
                            <input type="hidden" name="productId" value={product?.id} />
                            <input type="hidden" name="styling" value={Styling} />
                            <input type="hidden" name="functionality" value={Functionality} />
                            <input type="hidden" name="easeOfUse" value={EaseOfUse} />
                            <input type="hidden" name="needeness" value={Needeness} />
                            <input type="hidden" name="bonus" value={Bonus} />
                            <input type="hidden" name="hours" value={Hours} />
                            <input type="hidden" name="hoursJustification" value={HoursJustification} />
                            <Button type="submit" style="cursor: pointer;">Approve Product</Button>
                          </form>
                      </AlertDialog.Footer>
                  </AlertDialog.Content>
                  </AlertDialog.Root>
                <Button onclick={() => (rejected = true)} variant="destructive">Reject Product</Button>
                <AlertDialog.Root bind:open={rejected}>
                  <AlertDialog.Content>
                      <AlertDialog.Header>
                          <AlertDialog.Title>Confirm Product Rejection</AlertDialog.Title>
                          <AlertDialog.Description>
                              Are you sure you want to reject "{product?.fields["Product Name"] || 'this product'}"?
                          </AlertDialog.Description>
                      </AlertDialog.Header>
                        <div class="p-4">
                        <label for="rejectionReason" class="block text-sm font-medium mb-2">Rejection Reason:</label>
                        <textarea id="rejectionReason" bind:value={RejectionReason} required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter reason for rejection"></textarea></div>
                      <AlertDialog.Footer>
                          <AlertDialog.Cancel onclick={() => (rejected = false)} style="cursor: pointer;">Cancel</AlertDialog.Cancel>
                          <form method="POST" action="?/reject" use:enhance={() => {
                            return ({ result }) => {
                              rejected = false;
                              if (result.type === 'success') {
                                goto('/review/products');
                              }
                            };
                          }}>
                            <input type="hidden" name="productId" value={product?.id} />
                            <input type="hidden" name="rejectionReason" value={RejectionReason} />
                            <Button type="submit" variant="destructive" style="cursor: pointer;">Reject Product</Button>
                          </form>
                      </AlertDialog.Footer>
                  </AlertDialog.Content>
                  </AlertDialog.Root>
            </div>
        </div>
    </div>
</div> 