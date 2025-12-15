<script>
  import { Copy, Check, GithubLogo, Heart } from 'phosphor-svelte'
  import {
    STYLES,
    get0xFormat,
    parse0xFormat,
    hexToRgb,
    hexToHsl
  } from '@/lib/colorUtils.js'

  let hex = '#000000'
  let styles = {
    bold: false,
    underline: false,
    reverse: false,
    italic: false,
    blink: false,
    hiBlack: false,
    bright: false,
    dim: false
  }

  let inputValue = ''
  let copiedFormat = null

  $: rgb = hexToRgb(hex)
  $: hsl = hexToHsl(hex)
  $: lightness = hsl?.l || 50
  $: format0x = get0xFormat(hex, styles)
  $: formatRgb = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : ''
  $: formatHsl = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : ''

  function handleInput() {
    const trimmed = inputValue.trim()

    // Try SSRRGGBB format
    const parsed = parse0xFormat(trimmed)

    if (parsed) {
      hex = parsed.color
      styles = parsed.styles
      inputValue = ''
      return
    }

    // Try HEX format
    if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
      hex = trimmed
      inputValue = ''
    }
  }

  async function copy(value, format) {
    try {
      await navigator.clipboard.writeText(value)
      copiedFormat = format
      setTimeout(() => (copiedFormat = null), 2000)
    } catch (e) {
      console.error('Copy failed:', e)
    }
  }

  function toggleStyle(key) {
    styles[key] = !styles[key]
  }
</script>

<div class="flex min-h-screen flex-col items-center gap-4">
  <!-- Header -->
  <header class="flex flex-col items-center p-6">
    <h1 class="text-3xl font-semibold">SSRRGGBB Color Editor</h1>
    <p class="opacity-80">Terminal Color Configuration Tool</p>
  </header>

  <main
    class="flex w-full max-w-4xl flex-1 flex-col justify-center gap-4 px-6 md:flex-row"
  >
    <!-- Left: Color Picker -->
    <div
      class="flex h-fit w-full flex-col gap-4 rounded-xl border border-neutral-200/50 bg-neutral-50 p-4"
    >
      <!-- Simple Color Picker -->
      <div class="flex flex-col gap-2">
        <h2 class="font-medium">Pick Color</h2>
        <input
          type="color"
          bind:value={hex}
          class="min-h-20 w-full rounded-lg"
        />
      </div>

      <!-- Input -->
      <div class="flex flex-col gap-2">
        <label for="color-input" class="font-medium">Paste Color</label>

        <div class="flex flex-row flex-wrap gap-2">
          <input
            bind:value={inputValue}
            id="color-input"
            type="text"
            placeholder="e.g #000 or 0x00000000"
            class="flex-1 rounded-md border border-neutral-200/50 bg-white px-3 py-1.5 outline-none"
          />
          <button
            on:click={handleInput}
            class="cursor-pointer rounded-md bg-neutral-900 px-3 py-1.5 text-neutral-50 hover:bg-neutral-900/90"
          >
            Apply
          </button>
        </div>
      </div>

      <!-- Styles -->
      <div class="flex flex-col gap-2">
        <h2 class="font-medium">Text Styles</h2>

        <div class="grid grid-cols-2 gap-2">
          {#each Object.entries(STYLES) as [key, { label }] (key)}
            <button
              on:click={() => toggleStyle(key)}
              class="cursor-pointer rounded-md border border-neutral-200/50 bg-white px-3 py-1.5 text-neutral-800 hover:bg-neutral-100/10"
            >
              {label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Preview & Output -->
    <div
      class="flex h-fit w-full flex-col gap-4 rounded-xl border border-neutral-200/50 bg-neutral-50 p-4"
    >
      <!-- Preview -->
      <div class="flex flex-col gap-2">
        <h2 class="font-medium">Preview</h2>

        <div
          class="flex min-h-20 w-full items-center justify-center rounded-lg"
          style={`
              background-color: ${hex};
              color: ${lightness > 50 ? '#000' : '#fff'};
              font-weight: ${styles.bold ? 'bold' : 'normal'};
              font-style: ${styles.italic ? 'italic' : 'normal'};
              text-decoration: ${styles.underline ? 'underline' : 'none'};
              opacity: ${styles.dim ? '0.5' : '1'};
              filter: ${styles.bright ? 'brightness(1.5)' : 'none'};
            `}
        >
          {hex}
        </div>
      </div>

      <!-- Output -->
      <div class="flex flex-col gap-2">
        <h2 class="font-medium">Export</h2>

        <div
          class="flex flex-col gap-4 rounded-lg border border-neutral-200/50 bg-white p-4"
        >
          {#each [{ label: 'SSRRGGBB', value: format0x, key: '0x' }, { label: 'HEX', value: hex, key: 'hex' }, { label: 'RGB', value: formatRgb, key: 'rgb' }, { label: 'HSL', value: formatHsl, key: 'hsl' }] as { label, value, key } (key)}
            <div class="flex flex-row items-center justify-between gap-2">
              <div>
                <span>{label}</span>
                <span class="rounded-md bg-neutral-200 p-1.5">
                  {value}
                </span>
              </div>
              <button
                on:click={() => copy(value, key)}
                class="cursor-pointer rounded-md border border-neutral-200/50 p-1.5 shadow-2xl shadow-neutral-500 hover:bg-neutral-100/10"
              >
                {#if copiedFormat === key}
                  <Check size={18} />
                {:else}
                  <Copy size={18} />
                {/if}
              </button>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer
    class="mt-6 flex w-full flex-row flex-wrap items-center justify-center gap-2 bg-neutral-100 px-6 py-4 text-sm"
  >
    <p class="flex flex-row items-center gap-2">
      <span>Made with</span>
      <Heart size={18} weight="fill" class="text-red-500" />
      <span>for the community</span>
    </p>
    <a
      href="https://github.com/lpndev/SSRRGGBB-editor"
      target="_blank"
      class="flex flex-row items-center gap-2 underline"
    >
      <GithubLogo size={18} />
      <span>View on GitHub</span>
    </a>
  </footer>
</div>
