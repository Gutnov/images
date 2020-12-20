import React from 'react';
import {useState} from 'react'
import {ImagesList} from './components/ImagesList'

interface InotFound {
	show: boolean,
	tag: string
}
interface IdownloadButtonParams {
	text: string,
	disabled: boolean
}
interface Isort {
	text: string,
	isSort: boolean
}

interface ItagsArrItem {
	src: string,
	dataTag: string
}

const App:React.FC = () => {
	const [imgSrc, setImgSrc] = useState<Array<Array<ItagsArrItem>>>([])
	const [imputValue, setImputValue] = useState<string>('')
	const [tags, setTags] = useState<string[]>([])
	const [isTag, setIsTag] = useState<boolean>(true)
	const [notFound, setNotFound] = useState<InotFound>({
		show: false,
		tag: ''
	})
	const [isError, setIsError] = useState<boolean>(false)
	const [sort, setSort] = useState<Isort>({
		text: 'Групировать',
		isSort: false
	})
	const [downloadButtonParams, setDownloadButtonParams] = useState<IdownloadButtonParams>({
		text: 'Загруить',
		disabled: false
	})


	const inputHandler = (event: React.ChangeEvent<HTMLInputElement>):void => {
		if(!isTag) setIsTag(true)
		if(notFound) setNotFound({
			show: false,
			tag: ''
		})
		const val = event.target.value.replace(/[^a-z,]/g, '').replace(',,', ',')
		setImputValue(val)
	}
	
	const fetchImg = async () => {
		try {
			const tagsArr: any[] = []
			const filteredInputValueArr = imputValue.split(',').filter(src => src.length && src !== ',')
			for(const t of filteredInputValueArr) {
				if(!t)return
				let res: any = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=gTJAO48YcpmrADUyo4opy4ES4g7iDBxx&tag=${t}`)
				res = await res.json()
				if(res.meta.status !== 200) {
					setIsError(true)
				}
				if(Object.keys(res.data).length) {
					tagsArr.push({
						src:res.data['image_url'],
						dataTag: t
					})
					setTags(prev => [...prev, t])				
				} else {
					setNotFound({
						show: true,
						tag: t
					})
				}
			}
			if (tagsArr.length) {
				setImgSrc(prev => [...prev, tagsArr])
			}
			
		} catch (e) {
			console.log(e);
		}
	}

	const downloadImg = async () => {
		setIsError(false)
		if(!imputValue) {
			return setIsTag(false)
		}
		setDownloadButtonParams({
			text: 'Загрузка...',
			disabled: true
		})
		await fetchImg()
	
		setDownloadButtonParams({
			text: 'Загрузить',
			disabled: false
		})

		setImputValue('')
	}

	const sortHandler = ():void => {
		if(!sort.isSort) {
			setSort({
				text: 'Разгрупировать',
				isSort: true
			})
		}else {
			setSort({
				text: 'Групировать',
				isSort: false
			})
		}
	}

	const clearImages = ():void => {
		setImgSrc([])
	}
	const clickHandler = (dataImg:string):void => {
		setImputValue(dataImg)
	}
	return (
			<div className="container">
				<div className="controls">
						<div className="controls__input-wr">
							<input type="text" 
								className="form-control controls__input ivalid"
								onInput={inputHandler}
								value={imputValue}
								placeholder="Введите тег или несколько через запятую"
							/>
							{!isTag &&
								<div className="invalid-feedback">
									Введите тег
								</div>
							}
							{notFound.show &&
								<div className="form-text">По тегу {notFound.tag} ничего не найдено</div>
							}
						</div>
						
						<button
							className="btn btn-success" 
							onClick={downloadImg}
							disabled={downloadButtonParams.disabled}
						>{downloadButtonParams.text}</button>
						<button className="btn btn-danger" onClick={clearImages}>Очистить</button>
						<button className="btn btn-primary" onClick={sortHandler}>{sort.text}</button>
				</div>
				<ImagesList 
					imgSrc={imgSrc}
					tags={tags}
					sort={sort.isSort}
					clickHandler={clickHandler}
				/>
				{isError &&
					<h2 className="title">Произошла ошибка</h2>
				}
			</div>
	);
}

export default App;
