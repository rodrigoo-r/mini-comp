<script setup lang="ts">
// @ts-ignore
import TopLevelCard from './TopLevelCard.vue'
// @ts-ignore
import TopLevelCardHeader from './TopLevelCardHeader.vue'
import { ref } from 'vue'
import Lexer from '../api/Lexer'
import Parser from '../api/Parser'
// @ts-ignore
import Token, { tokenTypeToString, getTokenClass } from '../api/Token'
// @ts-ignore
import maxChars from '../api/MaxChars'
// @ts-ignore
import ASTViewer from './ASTViewer.vue'
// @ts-ignore
import TokenTypeToRegex from '../api/TokenTypeToRegex'

const inputText = ref('Given(Transaction t{Amount}, Client c{Money}) -> Such(t.Amount > c.Money) -> Reject')
const loading = ref(false)
const lexer = new Lexer()
const parser = new Parser()
const tokens = ref(lexer.lex(inputText.value));
const ast = ref(parser.parse(tokens.value));

// @ts-ignore
function lex() {
    if (loading.value) return;
    loading.value = true;

    try {
        tokens.value = lexer.lex(inputText.value);
        ast.value = parser.parse(tokens.value);
        loading.value = false;
    } catch (error) {
        // @ts-ignore
        alert('Error: ' + error.message);
        loading.value = false;
    }
}
</script>

<template lang="pug">
main
    .p-5(class="md:grid md:grid-cols-2 md:gap-5 pb-0")
        TopLevelCard
            TopLevelCardHeader
                strong Descripción
            .p-3
                p
                    | Este es un analizador léxico y sintáctico para un lenguaje de programación simple. 
                    | Puedes ingresar una cadena de texto en el área de entrada y hacer clic en "Enviar" para ver los tokens generados por el analizador léxico y el árbol de sintaxis abstracta (AST) generado por el analizador sintáctico.
                p.mt-3
                    | El analizador léxico divide la cadena de entrada en tokens, que son las unidades básicas del lenguaje. Cada token tiene un tipo y un valor, y se muestra en la sección de resultados.
                p.mt-3
                    | El analizador sintáctico toma los tokens generados por el analizador léxico y construye un árbol de sintaxis abstracta (AST) que representa la estructura del programa.
        TopLevelCard
            TopLevelCardHeader
                strong Entrada
            textarea.p-3(class="w-full h-32" v-model="inputText" :disabled="loading")
            .p-3
                button.rounded-full.bg-black.text-white.p-2.w-full.font-semibold.cursor-pointer.transition.transition-all.duration-300(
                    @click="lex"
                    :class="loading ? 'cursor-not-allowed opacity-50' : ''"
                )
                    span(v-if="!loading") Enviar
                    i.fas.fa-circle-notch.fa-spin(v-else)
    .p-5
        TopLevelCard
            TopLevelCardHeader
                strong Resultado
            TopLevelCardHeader
                p.font-bold Analizador Léxico (Lexer)
                .text-center.mt-5.mb-5.text-center
                    .flex.items-center.justify-center
                        .token.flex(v-for="(token, i) in tokens" :key="i")
                            p(:class="getTokenClass(token.type)+'-color'") {{ token.value }}
                            div(v-if="i < tokens.length - 1 && tokens[i + 1].col_start > token.col_end + 1") &nbsp;
                    .flex.items-center.justify-center.opacity-50
                        .token.flex.items-center(v-for="(token, i) in tokens" :key="i")
                            small(:class="getTokenClass(token.type)+'-color'") {{ maxChars(getTokenClass(token.type).replace("token-", ""), token.value.length) }}
                            div(v-if="i < tokens.length - 1 && tokens[i + 1].col_start > token.col_end + 1") &nbsp;
                .token.flex.mt-2(v-for="(token, i) in tokens" :key="i")
                    .flex.gap-2.items-center
                        .token-icon-bg.bg-black.text-white.rounded-xl.flex.items-center.justify-center(
                            :class="getTokenClass(token.type)"
                        )
                            i.fa-solid.fa-i-cursor
                        .flex.items-center.gap-1
                            p.text-lg.font-bold {{ tokenTypeToString(token.type) }}
                            small.text-gray-500.flex
                                .token-punctuation-color (
                                .token-keyword-color value=
                                .token-identifier-color {{ `"${token.value}"` }}
                                .token-punctuation-color ,&nbsp;
                                .token-keyword-color pos=
                                .token-identifier-color {{ `[${token.col_start}:${token.col_end}]` }}
                                .token-punctuation-color ,&nbsp;
                                .token-keyword-color regex=
                                .token-identifier-color {{ `${TokenTypeToRegex(token.type)}` }}
                                .token-punctuation-color )
            .p-3
                p.font-bold Analizador Sintáctico (Parser)
                ASTViewer.mt-3(:ast="ast" :depth="0")
</template>

<style lang="scss" scoped>
textarea {
    resize: none;
}

.token-icon-bg {
    width: 35px;
    height: 35px;
}

.token-identifier {
    background-color: #4caf50;
}

.token-keyword {
    background-color: #2196f3;
}

.token-punctuation {
    background-color: #ff9800;
}

.token-identifier-color {
    color: #4caf50;
}

.token-keyword-color {
    color: #2196f3;
}

.token-punctuation-color {
    color: #ff9800;
}
</style>