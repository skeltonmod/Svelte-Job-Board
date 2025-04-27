<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Button,
    Form,
    FormGroup,
    TextInput,
    TextArea,
    InlineNotification,
    Grid,
    Row,
    Column
  } from "carbon-components-svelte";
  
  let submitting = false;
  let success = false;
  let error = '';
  
  async function submitJob(event: Event) {
    event.preventDefault();
    submitting = true;
    
    try {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const response = await fetch('/api/jobs/submit', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.get('title'),
          company: formData.get('company'),
          location: formData.get('location'),
          email: formData.get('email'),
          description: formData.get('description'),
          category: formData.get('category')
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit job');
      }
      
      success = true;
      error = '';
      form.reset();
    } catch (err) {
      console.error(err);
      error = err instanceof Error ? err.message : 'There was an error submitting your job. Please try again.';
      success = false;
    } finally {
      submitting = false;
    }
  }
</script>

<Grid>
  <Row>
    <Column sm={4} md={8} lg={12} xlg={8} max={8}>
      <h1>Post a New Job</h1>
      <p>Fill out the form below to submit a new job listing.</p>
      
      {#if success}
        <InlineNotification 
          kind="success"
          title="Success"
          subtitle="Your job has been submitted successfully and is pending review."
          hideCloseButton
        />
      {/if}
      
      {#if error}
        <InlineNotification 
          kind="error" 
          title="Error" 
          subtitle={error}
          hideCloseButton
        />
      {/if}
      
      <Form on:submit={submitJob}>
        <FormGroup legendText="Job Title *">
          <TextInput
            id="title"
            name="title"
            labelText=""
            placeholder="Enter job title"
            required
          />
        </FormGroup>
        
        <FormGroup legendText="Company *">
          <TextInput
            id="company"
            name="company"
            labelText=""
            placeholder="Enter company name"
            required
          />
        </FormGroup>
        
        <FormGroup legendText="Location *">
          <TextInput
            id="location"
            name="location"
            labelText=""
            placeholder="Enter job location"
            required
          />
        </FormGroup>
        
        <FormGroup legendText="Email *">
          <TextInput
            id="email"
            name="email"
            labelText=""
            placeholder="Enter email address"
            type="email"
            required
            helperText="This email will be used to contact you about your job posting."
          />
        </FormGroup>
        
        <FormGroup legendText="Job Description *">
          <TextArea
            id="description"
            name="description"
            labelText=""
            placeholder="Enter job description"
            rows={5}
            required
          />
        </FormGroup>

        <FormGroup legendText="Category">
          <TextArea
            id="category"
            name="category"
            labelText=""
            placeholder="Enter job category"
            rows={5}
            required
          />
        </FormGroup>
        
        <Button 
          type="submit" 
          disabled={submitting}
          kind="primary"
        >
          {submitting ? 'Submitting...' : 'Submit Job'}
        </Button>
      </Form>
    </Column>
  </Row>
</Grid>