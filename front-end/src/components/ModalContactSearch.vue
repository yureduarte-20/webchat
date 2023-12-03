<script setup lang="ts">
import { searchUsers } from '@/services/searchUsers';
import MultiSelect from '@vueform/multiselect'
import { computed, ref, watch } from 'vue';
const searchString = ref('')
const props = defineProps([
    'title',
    'modelValue',
    'visible'
])
const options = ref<any[]>([])
const selectedContact = ref()
const emit = defineEmits(['update:modelValue', 'update:cancelRequest', 'update:on-choose'])
watch(searchString, () => {
    console.log(searchString.value)
    if (searchString.value === '') return;
    searchUsers(searchString.value, _options => {
           options.value = _options
    })
})

</script>
<template>
    <div v-if="props.visible" class="modal d-block">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="model-title">{{ props.title ?? 'Procurar usuários' }}</h5>
                    <button type="button" @click.prevent="$emit('update:cancelRequest')" class="btn-close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="exampleFormControlInput1" class="form-label">Email address</label>
                        <input @input="(e:any) => searchString = e.target.value" class="form-control" />
                    </div>
                    <select v-if="options.length > 0" class="form-select" v-model="selectedContact" aria-label="Selecionar usuários">
                        <option v-for="option of options"  :value="option.email" :key="option.id">
                            {{ option.name + "-" + option.email }}
                        </option>
                    </select>
                    <div class="modal-footer">
                        <button @click.prevent="() => $emit('update:on-choose', selectedContact)" class="btn btn-primary">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style src="@vueform/multiselect/themes/default.css"></style>