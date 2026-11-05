<script setup lang="ts">
// @ts-ignore
import AST, { astRuleToString } from '../api/AST'

const props = defineProps<{
    ast: AST,
    depth: number
}>();
</script>

<template lang="pug">
    .ast-viewer
        .flex
            span(v-for="_ in props.depth" :key="_") &nbsp;
            p {{ astRuleToString(props.ast.rule) }}{{ props.ast.value ? `: "${props.ast.value}"` : '' }}
        ASTViewer(v-for="(child, index) in props.ast.children" :key="index" :ast="child" :depth="props.depth + 4")
</template>