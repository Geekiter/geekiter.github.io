## 1. Table Text Alignment

```scss
th {
  text-align: center;
  vertical-align: middle;
}
```

The `vertical-align` property sets the vertical alignment of the content in `<th>` or `<td>` (such as top, bottom, or middle).

By default, the vertical alignment of content in a table is `middle`.

## 2. **box-sizing**

When an element is set to `box-sizing: border-box;`, its padding and border no longer increase its width.

## 3. How to Hide Table Borders

Set `border-top`, `border-left`, `border-bottom`, and `border-right` of `th` and `td` to `none`.

## 4. CSS Calculation

`calc()`

## 5. Horizontal Scrolling for Tables

```scss
.container1{
	width: 1000px;
}

.container2{
  position: relative;
  overflow: auto;
  white-space: nowrap;
}
```

```html
<div class="container1">
	<div class="container2">
			<table>
				<tbody>...</tbody>
			</table>
	</div>
</div>
```

## 6. Frozen Columns in Tables

```scss
.sticky-col {
  position: sticky;
	left: 0;
}
```

## 7. Multi-Row and Multi-Column Table Headers

```scss
<th rowSpan={1} colSpan={1} >
...
</th>
```

Use the `row-span` and `col-span` attributes.

## 8. Mixing Multi-Row and Multi-Column Table Headers

```scss
<thead>
	<tr>
		<th rowSpan={1} colSpan={1} >
		...
		</th>
	</tr>
	<tr>
	<th rowSpan={1} colSpan={1} >
	...
	</th>
	</tr>
</thead>
```

Calculate the positions of rows and columns that span multiple cells in advance, and the second row of headers will automatically appear in the reserved space.

## 9. Fixed Width for Table Content

```scss
<th>
	<div style="widh: 220px">...</div>
</th>
```

Nest a `<div>` element to achieve a fixed width.
