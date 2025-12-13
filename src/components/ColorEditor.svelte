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

<div>
  <!-- Banner -->
  <div class="bg-red-500">
    <p>This website is under development!</p>
    <p>Help me in my repo:</p>
  </div>

  <!-- Header -->
  <header>
    <h1>SSRRGGBB Color Editor</h1>
    <p>Terminal Color Configuration Tool</p>
  </header>

  <main>
    <!-- Left: Color Picker -->
    <div>
      <h2>Pick Color</h2>

      <!-- Simple Color Picker -->
      <div>
        <input type="color" bind:value={hex} />
        <div>
          <p>Current Color</p>
          <span>{hex}</span>
        </div>
      </div>

      <!-- Input -->
      <div>
        <label for="color-input">Paste Color (HEX or SSRRGGBB)</label>
        <input bind:value={inputValue} id="color-input" type="text" />
        <button on:click={handleInput}>Apply</button>
      </div>

      <!-- Styles -->
      <div>
        <h2>Text Styles</h2>
        <div>
          {#each Object.entries(STYLES) as [key, { label }] (key)}
            <button on:click={() => toggleStyle(key)}>
              {label}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right: Preview & Output -->
    <div>
      <!-- Preview -->
      <div>
        <h2>Preview</h2>
        <div
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
      <div>
        <h2>Export</h2>
        <div>
          {#each [{ label: 'SSRRGGBB', value: format0x, key: '0x' }, { label: 'HEX', value: hex, key: 'hex' }, { label: 'RGB', value: formatRgb, key: 'rgb' }, { label: 'HSL', value: formatHsl, key: 'hsl' }] as { label, value, key } (key)}
            <div>
              <div>
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <button on:click={() => copy(value, key)}>
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
  <footer>
    <div>
      <span>Made with</span>
      <Heart size={18} weight="fill" class="text-red-500" />
      <span>for the community</span>
    </div>
    <a href="https://github.com/lpndev/SSRRGGBB-editor" target="_blank">
      <GithubLogo size={18} />
      <span>View on GitHub</span>
    </a>
  </footer>
</div>
