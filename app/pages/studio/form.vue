<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";

interface FlightNote {
  callsign: string;
  mission: string;
  note: string;
}

const receipt = ref("");

const form = useForm({
  defaultValues: {
    callsign: "",
    mission: "KITE-4",
    note: "",
  } satisfies FlightNote,
  onSubmit: async ({ value }) => {
    receipt.value = `${value.callsign} filed a note on ${value.mission}: ${value.note}`;
  },
});

function required(value: string, label: string) {
  return value.trim() ? undefined : `${label} is required.`;
}
</script>

<template>
  <PageIntro
    kicker="TanStack Form"
    title="Flight note"
    lede="Field state and validation stay in TanStack Form. Submit prints a receipt on this desk; nothing is sent off the machine."
  />

  <form class="paper stack" @submit.prevent.stop="form.handleSubmit">
    <form.Field
      name="callsign"
      :validators="{ onChange: ({ value }) => required(value, 'Callsign') }"
    >
      <template #default="{ field }">
        <label>
          Callsign
          <input
            :name="field.name"
            :value="field.state.value"
            autocomplete="nickname"
            @blur="field.handleBlur"
            @input="
              field.handleChange(($event.target as HTMLInputElement).value)
            "
          />
        </label>
        <p v-if="field.state.meta.errors.length" class="error">
          {{ field.state.meta.errors[0] }}
        </p>
      </template>
    </form.Field>

    <form.Field name="mission">
      <template #default="{ field }">
        <label>
          Mission
          <select
            :name="field.name"
            :value="field.state.value"
            @change="
              field.handleChange(($event.target as HTMLSelectElement).value)
            "
          >
            <option>KITE-4</option>
            <option>HB-12</option>
            <option>LWL-2</option>
          </select>
        </label>
      </template>
    </form.Field>

    <form.Field
      name="note"
      :validators="{ onChange: ({ value }) => required(value, 'Note') }"
    >
      <template #default="{ field }">
        <label>
          Note
          <textarea
            :name="field.name"
            :value="field.state.value"
            rows="4"
            @blur="field.handleBlur"
            @input="
              field.handleChange(($event.target as HTMLTextAreaElement).value)
            "
          />
        </label>
        <p v-if="field.state.meta.errors.length" class="error">
          {{ field.state.meta.errors[0] }}
        </p>
      </template>
    </form.Field>

    <button class="paper-button primary" type="submit">File note</button>
    <p v-if="receipt" role="status">{{ receipt }}</p>
    <p v-else class="meta">The receipt appears here after a valid submit.</p>
  </form>
</template>
