import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Activities, Log } from '../type'
import logo from '../undip-logo.png'

function activitiesGen(activities: Activities[]) {
  let body = []
  const templateA = [
    [{ content: 'A. Jadwal Kegiatan', colSpan: 4 }],
    ['No.', 'Waktu', { content: 'Kegiatan', colSpan: 2 }]
  ]

  const templateB = [[{ content: 'B. Catatan Penting Harian', colSpan: 4 }]]

  body.push(...templateA)

  activities.forEach((activity, i) => {
    const newActivity = [
      i + 1,
      activity.time,
      {
        content: activity.name,
        colSpan: 2
      }
    ]
    body.push(newActivity)
  })

  body.push(...templateB)

  activities.forEach((activity, i) => {
    const newActivity = [
      { content: i + 1, styles: { lineWidth: 0 } },
      {
        content: activity.detail,
        colSpan: 3,
        styles: { lineWidth: 0 }
      }
    ]
    body.push(newActivity)
    body.push([
      {
        content: 'image' + i,
        colSpan: 4,
        styles: { minCellHeight: 55, lineWidth: 0 }
      }
    ])
  })

  return body
}

export function print(log: Log) {
  const doc = new jsPDF()

  autoTable(doc, {
    head: [
      [
        {
          content: '',
          rowSpan: 3,
          colSpan: 2
        },
        {
          content:
            'BUKU CATATAN HARIAN\nKULIAH KERJA NYATA\nUNIVERSITAS DIPONEGORO\n2021/2022',
          rowSpan: 3
        },
        {
          content: `Hari ke: ${log.dayCount}`,
          styles: { lineWidth: 0, fontStyle: 'normal' }
        }
      ],
      [
        {
          content: `Hari: ${log.day}`,
          styles: { lineWidth: 0, fontStyle: 'normal' }
        }
      ],
      [
        {
          content: `Tanggal: ${log.date}`,
          styles: { lineWidth: 0, fontStyle: 'normal' }
        }
      ]
    ],
    body: activitiesGen(log.activities),
    didDrawCell: (data) => {
      if (data.section === 'head' && data.column.index === 0) {
        doc.addImage(logo, 'png', data.cell.x + 2, data.cell.y + 2, 20, 20)
      }

      log.activities.forEach((activity, i) => {
        if (data.cell.text[0] === 'image' + i) {
          if (!activity.documentation) return
          doc.addImage(
            activity.documentation,
            activity.documentation.split(';')[0].split('/')[1],
            data.cell.x + 2,
            data.cell.y + 2,
            50,
            50
          )
        }
      })
    },
    rowPageBreak: 'avoid',
    theme: 'plain',
    headStyles: { valign: 'middle' },
    styles: { lineColor: [0, 0, 0], lineWidth: 0.1, fontSize: 12 },
    tableLineWidth: 0.2,
    tableLineColor: [0, 0, 0]
  })

  const finalY = (doc as any).previousAutoTable.finalY + 10
  const rightMost =
    doc.internal.pageSize.getWidth() -
    (doc as any).previousAutoTable.settings.margin.right

  doc.setFontSize(12)
  doc.text(`${log.city}, ${log.date}`, rightMost, finalY, { align: 'right' })
  doc.text(log.name, rightMost - 30, finalY + 40, { align: 'center' })

  if (log.signature) {
    doc.addImage(
      log.signature,
      log.signature.split(';')[0].split('/')[1],
      rightMost - 45,
      finalY + 5,
      30,
      30
    )
  }

  doc.save(
    new Date(log.date).toLocaleString('id', { month: 'short' }) +
      '-' +
      new Date(log.date).toLocaleString('id', { day: 'numeric' }) +
      '.pdf'
  )
}
