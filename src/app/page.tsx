// Замените существующий useEffect и функцию fetchData на этот блок:

const [threatIndex, setThreatIndex] = useState(0); // Состояние для общего индекса

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const activeThreats = config.threats.filter(t => t.active);
      
      const results = await Promise.all(activeThreats.map(async (threat) => {
        try {
          // Запрос к API по slug из конфига
          const res = await fetch(`https://gamma-api.polymarket.com/markets?slug=${threat.slug}`);
          
          if (!res.ok) throw new Error('Network error');
          
          const marketData = await res.json();
          
          // Проверяем наличие данных. Если рынка нет, возвращаем вероятность 0
          if (!marketData || marketData.length === 0) {
            return { ...threat, prob: 0, error: true };
          }

          const market = marketData[0];
          // Парсим цену исхода "YES" (обычно это индекс 0)
          const probability = Math.round(parseFloat(market.outcomePrices[0]) * 100);

          return {
            ...threat,
            prob: probability,
            lastUpdate: new Date().toLocaleTimeString()
          };
        } catch (err) {
          console.error(`Ошибка загрузки маркера ${threat.slug}:`, err);
          return { ...threat, prob: 0, error: true };
        }
      }));

      setData(results);

      // Расчет общего индекса тревоги (среднее значение всех активных угроз)
      if (results.length > 0) {
        const totalProb = results.reduce((acc, curr) => acc + curr.prob, 0);
        setThreatIndex(Math.round(totalProb / results.length));
      }

    } catch (e) {
      console.error("Критическая ошибка системы мониторинга:", e);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  
  // Опционально: автоматическое обновление данных каждые 5 минут
  const interval = setInterval(fetchData, 300000);
  return () => clearInterval(interval);
}, []);
