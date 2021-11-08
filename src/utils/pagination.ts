// Credits to SkyDonald#2666
import { Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'

export async function pagination(message: Message, embeds: MessageEmbed[]) {
    let nextButton = new MessageButton().setCustomId('next').setLabel('Next').setStyle('SECONDARY')
    let previousButton = new MessageButton().setCustomId('previous').setLabel('Previous').setStyle('SECONDARY')
    let deleteButton = new MessageButton().setCustomId('delete').setLabel('Delete').setStyle('SECONDARY')

    let page = 0
    const row = new MessageActionRow().addComponents(previousButton, deleteButton, nextButton)

    const current = await message.channel.send({
        embeds: [embeds[page]],
        components: [row]
    })

    const collector = current.createMessageComponentCollector({
        filter: i => (i.customId === deleteButton.customId || i.customId === nextButton.customId || i.customId === previousButton.customId) && i.user.id === message.author.id,
        time: 120000
    })

    collector.on('collect', async i => {
        if (i.customId === nextButton.customId) {
            page++
            if (page >= embeds.length) page = 0
        } else if (i.customId === previousButton.customId) {
            page--
            if (page < 0) page = embeds.length - 1
        } else if (i.customId === deleteButton.customId) {
            return collector.stop()
        }
        await i.update({
            embeds: [embeds[page]],
            components: [row]
        })
        collector.resetTimer()
    })

    collector.on('end', () => {
        if (!current.deleted) {
            current.edit({
                embeds: [embeds[page]],
                components: []
            })
        }
    })
}
