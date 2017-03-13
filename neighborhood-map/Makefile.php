<?php

class Makefile
{
    /**
     * @var string
     */
    protected $filename;

    /**
     * @var string
     */
    protected $destination;

    /**
     * @var array
     */
    protected $items;

    /**
     * @param string $filename
     * @return void
     */
    public function __construct($filename, $destination)
    {
        $this->filename = $filename;
        $this->destination = $destination;
    }

    /**
     * @return void
     */
    public function handle()
    {
        if (($handle = fopen($this->filename, 'r')) !== false) {
            while (($data = fgetcsv($handle, 1000, ',')) !== false) {
                try {
                    $value = $this->transform($data);
                    $unique = $value['locality'];
                    $this->items[$unique] = $value;
                } catch (InvalidArgumentException $ex) {
                    print '$ex: ' . $ex->getMessage() . PHP_EOL;
                }
            }
            fclose($handle);

            return $this->save();
        }

        throw new RuntimeException;
    }

    /**
     * @param array $data
     * @return array
     */
    protected function transform($data)
    {
        list($locality, $district, $province, $lat, $long) = $data;

        # if ($province !== 'Rayong') {
        #     throw new InvalidArgumentException(vsprintf('"%s" is skipped.', implode(',', $data)));
        # }

        $transform = compact('locality', 'district', 'province', 'lat', 'long');
        foreach ($transform as $value) {
            if ( ! $value) {
                throw new InvalidArgumentException(vsprintf('"%s" is not valid.', implode(',', $data)));
            }
        }

        return $transform;
    }

    /**
     * @return void
     */
    protected function save()
    {
        file_put_contents($this->destination, json_encode($this->items, JSON_PRETTY_PRINT));
    }
}

(new Makefile('tambons.csv', 'tambons.json'))->handle();
