import React from 'react'

interface ItagsArrItem {
	src: string,
	dataTag: string
}
interface tagsProps {
	imgSrc: ItagsArrItem[][],
	tags: string[],
	sort: boolean,
	clickHandler: (dataImg: string) => void
}

export const ImagesList:React.FC<tagsProps> = props => {
	const NoSortedImg = () =>
	(<div className="images">
			{props.imgSrc.map((s, index) => {
					return (
						<div key={index}>
								{s.map(i => {
									return (
										<div className="images__item" key={i.src}>
											<img
												src={i.src}
												data-img={i.dataTag}
												onClick={() => props.clickHandler(i.dataTag)}
												alt=""
											/>
										</div>
									)
								})}
						</div>
					)
				})}
	</div>)
	const sortedImg = () => {
		const set = new Set(props.tags)
		const nonRepeatingTags: string[] = Array.from(set)

		return (
		<div className="images-sorted">
			{
				nonRepeatingTags.map(t => {
					return(
						<>
							<h1>{t}</h1>
							<div className="images-section" key={t}>
								{props.imgSrc.map((s, index) => {
									return (
										s.map(i => {
											if (i.dataTag === t) {
												return (
													<div className="images__item" key={i.src}>
														<img
															src={i.src}
															data-img={i.dataTag}
															onClick={() => props.clickHandler(i.dataTag)}
															alt=""
														/>
													</div>	
												)
											}
											return false
										})
									)
								})}
							</div>
						</>
					)
				})
			}
		</div>
	)}
	return props.sort ? sortedImg() : NoSortedImg()
}